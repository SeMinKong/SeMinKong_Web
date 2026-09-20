"""Patch the reviewed Drive Resume; preserve every original formatting component.

Run with bundled Python and --template <unchanged Drive DOCX>. Render in Word,
inspect the one-page PDF, and sync the public DOCX/PDF/preview after verification.
"""
import argparse
from copy import deepcopy
import hashlib
from pathlib import Path
from zipfile import ZipFile
from lxml import etree

ROOT = Path(__file__).resolve().parents[2]
TEMPLATE_SHA256 = '9dcf6d7bd8b7178152a8a9fa0170377023585750b919b22c295dc7247e87c8a1'
NS = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main',
      'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'}


def set_texts(paragraph, values):
    nodes = paragraph.xpath('.//w:t', namespaces=NS)
    if len(nodes) != len(values):
        raise ValueError('Source text slots changed')
    for node, value in zip(nodes, values):
        node.text = value
        node.set('{http://www.w3.org/XML/1998/namespace}space', 'preserve')
    return paragraph


def black_rules(root):
    for rule in root.xpath('//w:pBdr/*[@w:color]', namespaces=NS):
        rule.set('{%s}color' % NS['w'], '000000')
        for attr in ['themeColor', 'themeTint', 'themeShade']:
            rule.attrib.pop('{%s}%s' % (NS['w'], attr), None)


def build(template, output):
    if hashlib.sha256(template.read_bytes()).hexdigest() != TEMPLATE_SHA256:
        raise ValueError('Use the unchanged reviewed Drive template; re-audit other versions before editing.')
    with ZipFile(template) as source:
        parts = {name: source.read(name) for name in source.namelist()}
        doc = etree.fromstring(parts['word/document.xml'])
        body = doc.find('w:body', NS)
        p = body.findall('w:p', NS)
        assert len(p) == 42
        # English updates reflect the current web Resume; original layout stays.
        replacements = {
            1: ['SOFTWARE DEVELOPER'],
            4: ['Software engineering graduate with experience connecting computer vision, ROS 2, backend services, and hardware integration to build working systems. I enjoy learning new technologies and turning ideas into systems that I can build and test.'],
            22: ['ROS 2 | MediaPipe | OpenCV | Jetson | Raspberry Pi 5 | DYNAMIXEL | React | Django | AWS EC2 | ', 'Case Study'],
            23: ['Team project mapping 21 MediaPipe hand landmarks to a seven-axis HandCommand.'],
            24: ['Handled Blender modeling, 3D printing, synchronized seven-motor control and U2D2 communication, ROS bridge and Cyclone DDS configuration, and tendon mechanism integration.'],
            26: ['ROS 2 | FastAPI | React | RealSense | Dobot | YOLOv5 | RoboDK | ', 'Repository'],
            27: ['Team project spanning physical inspection and Dobot sorting, RoboDK process simulation, and SLAM-based robot monitoring.'],
            28: ['Trained YOLO; configured the integrated ROS environment, RealOps and separate MJPEG video streams, package-based navigation to designated goals, and RoboDK command/state relay.'],
            31: ['Implemented YOLO11 classification and segmentation, mask-to-polygon preprocessing, and a unified inference interface.'],
            32: ['Performance verification with independent evaluation data and execution logs remains to be completed.'],
            35: ['Built a real-time multiplayer game with React and Socket.io.'],
            36: ['Implemented server-authoritative state, input limits, and collision, friction, and position-correction calculations.'],
        }
        for index, values in replacements.items():
            set_texts(p[index], values)
        # Clone the existing header, italic stack and two-bullet project pattern.
        briefit = [deepcopy(p[i]) for i in [33, 34, 35, 36]]
        set_texts(briefit[0], ['Briefit', ' | Team AI Engineer, AI-Based News Curation', 'May 2025 - Sep 2025'])
        set_texts(briefit[1], ['Python | aiohttp | BeautifulSoup | Transformers | KoBART | ', 'Repository'])
        briefit[1].find('w:hyperlink', NS).set('{%s}id' % NS['r'], 'rId10')
        set_texts(briefit[2], ['Team news curation service for browsing articles from multiple outlets and reading summaries. Collected and cleaned about 4,000 articles with Crawl4AI and fine-tuned KoBART on about 3,000.'])
        set_texts(briefit[3], ['Compared T5 and KoBART with ROUGE and integrated the Gemini API to improve service summaries.'])
        position = body.index(p[37])
        for paragraph in briefit:
            body.insert(position, paragraph)
            position += 1
        # Reuse the original bold title / supporting copy / right-date award row.
        award_template = deepcopy(p[38])
        awards = [
            ('SSAFY Common Project - Excellence Award', ' | AIoT Track, Gwangju Class 1 (1st Place)', '10 Aug 2026'),
            ('2025 IT Project Pro League - Encouragement Award', ' | Soongsil University Spartan SW Education Center', '22 Nov 2025'),
            ('15th Soongsil Capstone Design Competition - Encouragement Award', ' | Soongsil University', '1 Oct 2025'),
            ('2025 College of IT Software Competition - Gold Prize', ' | Soongsil University College of IT', '18 Aug 2025'),
            ('Engineer Information Processing', ' | National Technical Qualification, Ministry of Science and ICT', '11 Sep 2026'),
        ]
        position = body.index(p[38])
        for old in p[38:41]:
            body.remove(old)
        for values in awards:
            body.insert(position, set_texts(deepcopy(award_template), values))
            position += 1
        black_rules(doc)
        styles = etree.fromstring(parts['word/styles.xml'])
        black_rules(styles)
        parts['word/document.xml'] = etree.tostring(doc, encoding='UTF-8', xml_declaration=True, standalone=True)
        parts['word/styles.xml'] = etree.tostring(styles, encoding='UTF-8', xml_declaration=True, standalone=True)
        output.parent.mkdir(parents=True, exist_ok=True)
        with ZipFile(output, 'w') as target:
            for info in source.infolist():
                target.writestr(info, parts[info.filename])
    print(output)


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--template', type=Path, required=True)
    parser.add_argument('--output', type=Path, default=ROOT / 'tmp/resume-corrected/SeMinKong-Resume.docx')
    args = parser.parse_args()
    build(args.template, args.output)
