"""Remove source metadata without recompressing pixels; retain JPEG orientation.

Original THING photos remain in the ignored evidence clone. Only the three named
working assets are eligible. The PDF encoder already strips photograph metadata.
"""
from io import BytesIO
from pathlib import Path
import hashlib
import json
import struct

from PIL import Image

ASSETS = Path(__file__).resolve().parent / 'assets'


def sanitize_jpeg(data, orientation):
    assert data[:2] == b'\xff\xd8'
    # A minimal EXIF TIFF with the orientation entry only (no GPS or thumbnail).
    exif = b'Exif\0\0II*\0\x08\0\0\0' + struct.pack('<H', 1)
    exif += struct.pack('<HHI', 274, 3, 1) + struct.pack('<H', orientation) + b'\0' * 6
    output = bytearray(data[:2] + b'\xff\xe1' + struct.pack('>H', len(exif) + 2) + exif)
    cursor = 2
    while cursor < len(data):
        assert data[cursor] == 255
        marker = data[cursor + 1]
        if marker == 0xda:  # The scan and compressed image bytes remain verbatim.
            output.extend(data[cursor:])
            return bytes(output)
        size = struct.unpack('>H', data[cursor + 2:cursor + 4])[0]
        end = cursor + size + 2
        assert end <= len(data)
        if marker not in (0xe1, 0xed, 0xfe):  # EXIF/XMP, IPTC, comments
            output.extend(data[cursor:end])
        cursor = end
    raise ValueError('JPEG scan not found')


def sanitize_png(data):
    assert data[:8] == b'\x89PNG\r\n\x1a\n'
    output = bytearray(data[:8])
    cursor = 8
    while cursor < len(data):
        size = struct.unpack('>I', data[cursor:cursor + 4])[0]
        kind = data[cursor + 4:cursor + 8]
        end = cursor + size + 12
        assert end <= len(data)
        if kind not in (b'eXIf', b'iTXt', b'tEXt', b'zTXt'):
            output.extend(data[cursor:end])
        cursor = end
    return bytes(output)


def main():
    for name in ('thing-spool-tendon.jpg', 'thing-acrylic-mount.jpg', 'aqis-architecture-source.png'):
        path = ASSETS / name
        original = path.read_bytes()
        with Image.open(BytesIO(original)) as before:
            orientation = before.getexif().get(274, 1)
            pixels = before.tobytes()
            size = before.size
        clean = sanitize_jpeg(original, orientation) if path.suffix == '.jpg' else sanitize_png(original)
        with Image.open(BytesIO(clean)) as after:
            assert after.size == size and after.tobytes() == pixels
            if path.suffix == '.jpg':
                assert dict(after.getexif()) == {274: orientation}
            else:
                assert not any('xml' in key.lower() or 'exif' in key.lower() for key in after.info)
        path.write_bytes(clean)
        print(json.dumps(dict(file=name, pixel_identical=True, orientation=orientation,
                              sha256=hashlib.sha256(clean).hexdigest().upper())))


if __name__ == '__main__':
    main()
