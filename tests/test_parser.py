import pytest
from app.services.parser_service import DocumentParserService

def test_clean_text():
    raw = "  Hello   world \r\n\r\n\r\n this is   a test  \n\n\n text. "
    cleaned = DocumentParserService.clean_text(raw)
    assert "Hello world" in cleaned
    assert "\n\n\n" not in cleaned

def test_parse_txt_bytes():
    sample = b"John Doe\nSoftware Engineer\nSkills: Python, FastAPI"
    extracted = DocumentParserService.parse_txt(sample)
    assert "John Doe" in extracted
    assert "FastAPI" in extracted

def test_parse_file_unsupported():
    with pytest.raises(ValueError) as exc:
        DocumentParserService.parse_file("resume.xyz", b"some content")
    assert "Unsupported file format" in str(exc.value)
