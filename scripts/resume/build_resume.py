"""Update the one-page resume using the reviewed Drive document as its template.

Run with bundled Python and --template <unchanged Drive DOCX>. Export from Word
as PDF/A to embed the fonts, then verify the one-page PDF and its 150 dpi preview.
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


def add_featured_projects(body, template_rows, relationships):
    cases = [
        (
            'Tac-Touch', 'SSAFY Autonomous Project with TacRobot', 'Oct 2026 - Nov 2026',
            'C++ | Arduino | Model Context Protocol',
            'Wrote firmware to distinguish still fingertips from failed sensor reads and verified both cases on the desktop.',
            "Connected the desktop editor to MCP so an AI tool can adjust a gripper's mounting angle and save a copy.",
            'tac-touch',
        ),
        (
            'Bondi', 'SSAFY Specialization Project, VR Museum', '2026 (4 weeks)',
            'TRELLIS | AdaPoinTr | Blender | Unreal Engine | OpenXR',
            'Tested point-cloud completion on a 3D model built from one photo of a damaged comb-pattern pottery vessel.',
            'Built VR galleries and hand controls to grasp, rotate and compare damaged and reconstructed pottery.',
            'bondi',
        ),
    ]
    position = body.index(template_rows[0])
    for number, (name, role, date, stack, first, second, slug) in enumerate(cases, start=14):
        relationship_id = f'rId{number}'
        etree.SubElement(relationships, relationships[0].tag, Id=relationship_id,
                         Type=NS['r'] + '/hyperlink', TargetMode='External',
                         Target=f'https://seminkong.github.io/SeMinKong_Web/work/{slug}/')
        title, technologies, first_bullet, second_bullet = map(deepcopy, template_rows)
        set_texts(title, [name, ' | ' + role, date])
        set_texts(technologies, [stack + ' | ', 'Case Study'])
        technologies.find('w:hyperlink', NS).set('{%s}id' % NS['r'], relationship_id)
        set_texts(first_bullet, [first])
        set_texts(second_bullet, [second])
        for paragraph in [title, technologies, first_bullet, second_bullet]:
            body.insert(position, paragraph)
            position += 1


def tac_touch_badge(award_template):
    badge = deepcopy(award_template)
    for run in badge.findall('w:r', NS)[1:]:
        badge.remove(run)
    set_texts(badge, [' Tac-Touch '])
    properties = badge.find('w:r/w:rPr', NS)
    properties.find('w:color', NS).set('{%s}val' % NS['w'], '332506')
    properties.find('w:shd', NS).set('{%s}fill' % NS['w'], 'E8C477')
    return badge


def build(template, output):
    if hashlib.sha256(template.read_bytes()).hexdigest() != TEMPLATE_SHA256:
        raise ValueError('Use the unchanged reviewed Drive template; re-audit other versions before editing.')
    with ZipFile(template) as source:
        parts = {name: source.read(name) for name in source.namelist()}
        doc = etree.fromstring(parts['word/document.xml'])
        relationships = etree.fromstring(parts['word/_rels/document.xml.rels'])
        body = doc.find('w:body', NS)
        p = body.findall('w:p', NS)
        assert len(p) == 42
        # English updates reflect the current web Resume; original layout stays.
        replacements = {
            1: ['SOFTWARE DEVELOPER'],
            4: ['I build software for robots and immersive exhibits. My recent work spans tactile sensor firmware, desktop gripper tools and 3D reconstruction for a VR museum.'],
            13: ['Robotics & XR: ', 'ROS 2, DYNAMIXEL XL330, Jetson, Raspberry Pi 5, RealSense, Dobot, Isaac Sim / Isaac Lab, OpenXR'],
            17: ['Building robotics and computer vision systems through team projects in firmware, perception and interactive 3D applications.'],
            22: ['ROS 2 | MediaPipe | OpenCV | Jetson | Raspberry Pi 5 | DYNAMIXEL | React | Django | AWS EC2 | ', 'Case Study'],
            23: ['Team project mapping 21 MediaPipe hand landmarks to a seven-axis HandCommand.'],
            24: ['Handled Blender modeling, 3D printing, synchronized seven-motor control and U2D2 communication, ROS bridge and Cyclone DDS configuration, and tendon mechanism integration.'],
            26: ['ROS 2 | FastAPI | React | RealSense | Dobot | YOLOv5 | RoboDK | ', 'Repository'],
            27: ['Team project spanning physical inspection and Dobot sorting, RoboDK process simulation, and SLAM-based robot monitoring.'],
            28: ['Trained YOLO; configured the integrated ROS environment, RealOps and separate MJPEG video streams, package-based navigation to designated goals, and RoboDK command/state relay.'],
            31: ['Implemented YOLO11 classification and segmentation, mask-to-polygon preprocessing, and a unified inference interface.'],
            32: ['Performance verification with independent evaluation data and execution logs remains to be completed.'],
        }
        for index, values in replacements.items():
            set_texts(p[index], values)
        add_featured_projects(body, p[21:25], relationships)
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
        for removed in p[33:37]:
            body.remove(removed)
        for rel in list(relationships):
            if rel.get('Id') == 'rId12':
                relationships.remove(rel)
        # Reuse the original bold title / supporting copy / right-date award row.
        award_template = deepcopy(p[38])
        awards = [
            ('SSAFY Autonomous Project - 1st Place', ' | Tac-Touch', '2026'),
            ('SSAFY Specialization Project - 2nd Place', ' | Bondi', '2026'),
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
        parts['word/_rels/document.xml.rels'] = etree.tostring(relationships, encoding='UTF-8', xml_declaration=True, standalone=True)
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
