# API — Licensing

Tài liệu mô tả các API endpoints cho module Cấp phép bản quyền nhạc (Licensing System). Tất cả các API yêu cầu xác thực sử dụng Bearer Token (JWT).

## Endpoints

### 1. Lấy danh sách license đã sở hữu
*   **Method**: `GET`
*   **Path**: `/licenses/my`
*   **Auth**: `User` (Bearer Token)
*   **Response (200 OK)**:
    ```json
    [
      {
        "id": "uuid",
        "licenseType": "personal",
        "licenseKey": "STMV-SUMM-PERS-A1B2C3D4",
        "pricePaid": 0,
        "currency": "USD",
        "createdAt": "2026-05-27T18:00:00Z",
        "song": {
          "id": "uuid",
          "title": "Summer Breeze",
          "genre": "Synthwave",
          "fileUrl": "songs/uuid/summer_breeze.mp3"
        }
      }
    ]
    ```

### 2. Lấy cấu hình license của bài hát
*   **Method**: `GET`
*   **Path**: `/licenses/songs/:songId/options`
*   **Auth**: Public
*   **Response (200 OK)**:
    ```json
    {
      "id": "uuid",
      "songId": "uuid",
      "personalPrice": 0,
      "personalEnabled": true,
      "commercialPrice": 2999,
      "commercialEnabled": true,
      "remixPrice": 1499,
      "remixEnabled": true,
      "exclusivePrice": 49900,
      "exclusiveEnabled": false
    }
    ```

### 3. Cập nhật cấu hình license bài hát
*   **Method**: `POST`
*   **Path**: `/licenses/songs/:songId/config`
*   **Auth**: `Creator` (Chỉ chủ sở hữu bài hát)
*   **Request Body**:
    ```json
    {
      "personalEnabled": true,
      "commercialPrice": 1999,
      "commercialEnabled": true,
      "remixEnabled": true,
      "exclusiveEnabled": false
    }
    ```
*   **Response (200 OK)**: Cấu hình mới cập nhật.

### 4. Nhận Personal license miễn phí
*   **Method**: `POST`
*   **Path**: `/licenses/purchase-free`
*   **Auth**: `User`
*   **Request Body**:
    ```json
    {
      "songId": "uuid"
    }
    ```
*   **Response (201 Created)**:
    ```json
    {
      "id": "uuid",
      "userId": "uuid",
      "songId": "uuid",
      "licenseType": "personal",
      "licenseKey": "STMV-SUMM-PERS-XYZ12345",
      "pricePaid": 0,
      "currency": "USD"
    }
    ```

### 5. Kiểm tra tính hợp lệ của license
*   **Method**: `GET`
*   **Path**: `/licenses/validate/:songId`
*   **Auth**: `User`
*   **Response (200 OK)**:
    ```json
    {
      "isValid": true
    }
    ```

## Related
- [[SRS-Licensing]]
