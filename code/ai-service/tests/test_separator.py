import os
import tempfile
import pytest
from utils.demucs_separator import separate_stems

def test_fallback_to_mock_separator():
    # 1. Tạo file audio gốc giả lập
    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as tmp_input:
        tmp_input.write(b"dummy audio content")
        input_path = tmp_input.name

    # 2. Tạo thư mục output giả lập
    with tempfile.TemporaryDirectory() as temp_dir:
        # Gọi hàm tách nhạc (hàm sẽ tự động lỗi Demucs & Spleeter do thiếu thư viện và chuyển về Mock)
        result = separate_stems(input_path, temp_dir)
        
        # 3. Xác minh kết quả trả về đúng 4 stems
        assert "vocal" in result
        assert "drums" in result
        assert "bass" in result
        assert "other" in result
        
        # 4. Xác minh các file thực sự tồn tại trong thư mục output
        for stem_name, path in result.items():
            assert os.path.exists(path)
            # File stem copy nên dung lượng phải giống file gốc
            with open(path, "rb") as f:
                content = f.read()
                assert content == b"dummy audio content"

    # Dọn dẹp file đầu vào
    if os.path.exists(input_path):
        os.remove(input_path)
