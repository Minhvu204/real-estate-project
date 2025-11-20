# Hướng dẫn Test Review API trên Postman

## 📋 Mục lục
1. [Chuẩn bị](#chuẩn-bị)
2. [Import Postman Collection](#import-postman-collection)
3. [Các bước test](#các-bước-test)
4. [API Endpoints](#api-endpoints)
5. [Test Cases](#test-cases)

---

## 🚀 Chuẩn bị

### 1. Khởi động server
```bash
npm run dev
# hoặc
npm start
```

Server sẽ chạy tại: `http://localhost:3000`

### 2. Đăng nhập để lấy token

**POST** `/api/client/auth/login`

Request Body:
```json
{
  "email": "buyer@example.com",
  "password": "password123"
}
```

Response sẽ có `accessToken`, copy token này để dùng cho các request tiếp theo.

---

## 📥 Import Postman Collection

1. Mở Postman
2. Click **Import** (góc trên bên trái)
3. Chọn file `Buyer_Review_API.postman_collection.json`
4. Collection sẽ xuất hiện trong sidebar

---

## 🔧 Các bước test

### Bước 1: Setup Variables

1. Mở collection **Buyer Review API**
2. Click tab **Variables**
3. Điền các giá trị:
   - `baseUrl`: `http://localhost:3000`
   - `token`: Token JWT từ login (sẽ tự động cập nhật nếu dùng script)
   - `propertyId`: ID của property đã có appointment/deal
   - `agentId`: ID của agent đã có appointment/deal
   - `reviewId`: Sẽ được lấy từ response sau khi tạo review

### Bước 2: Test tạo Review

#### Test 1: Tạo review cho Property
- Request: **POST** `/api/client/buyer/reviews`
- Body:
```json
{
  "target_id": "{{propertyId}}",
  "target_type": "property",
  "rating": 5,
  "comment": "Property rất đẹp, vị trí tuyệt vời!"
}
```

**Lưu ý**: 
- `propertyId` phải là property mà buyer đã có:
  - Appointment với status `accepted` hoặc `completed`
  - Hoặc Deal với status `completed`

#### Test 2: Tạo review cho Agent
- Request: **POST** `/api/client/buyer/reviews`
- Body:
```json
{
  "target_id": "{{agentId}}",
  "target_type": "agent",
  "rating": 4,
  "comment": "Agent rất nhiệt tình và chuyên nghiệp!"
}
```

**Lưu ý**: 
- `agentId` phải là agent mà buyer đã có:
  - Appointment với status `accepted` hoặc `completed`
  - Hoặc Deal với status `completed`

### Bước 3: Test lấy danh sách Reviews

#### Test 3: Lấy tất cả reviews
- Request: **GET** `/api/client/buyer/reviews?page=1&limit=10`

#### Test 4: Lọc theo target_type
- Request: **GET** `/api/client/buyer/reviews?target_type=property&page=1&limit=10`
- Request: **GET** `/api/client/buyer/reviews?target_type=agent&page=1&limit=10`

#### Test 5: Lọc theo rating
- Request: **GET** `/api/client/buyer/reviews?rating=5&page=1&limit=10`

### Bước 4: Test cập nhật Review

- Request: **PATCH** `/api/client/buyer/reviews/{{reviewId}}`
- Body:
```json
{
  "rating": 5,
  "comment": "Đã cập nhật: Property tuyệt vời hơn tôi nghĩ!"
}
```

**Lưu ý**: Có thể cập nhật chỉ `rating` hoặc chỉ `comment` hoặc cả hai.

### Bước 5: Test xóa Review

- Request: **DELETE** `/api/client/buyer/reviews/{{reviewId}}`

---

## 📚 API Endpoints

### 1. POST `/api/client/buyer/reviews`
Tạo review mới

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**
```json
{
  "target_id": "string (ObjectId)",
  "target_type": "property" | "agent",
  "rating": 1-5 (integer),
  "comment": "string (optional)"
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Tạo review thành công",
  "data": {
    "_id": "...",
    "user_id": {...},
    "target_id": {...},
    "target_type": "property",
    "rating": 5,
    "comment": "...",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

**Lỗi:**
- `400`: Thiếu fields, rating không hợp lệ, target không tồn tại
- `401`: Chưa đăng nhập
- `403`: Không có tương tác thực với target
- `409`: Đã review target này rồi

---

### 2. GET `/api/client/buyer/reviews`
Lấy danh sách reviews của buyer

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `page` (optional): Số trang (mặc định: 1)
- `limit` (optional): Số lượng mỗi trang (mặc định: 10, tối đa: 50)
- `target_type` (optional): `"property"` hoặc `"agent"`
- `rating` (optional): 1-5

**Response 200:**
```json
{
  "success": true,
  "message": "Lấy danh sách review thành công",
  "data": {
    "data": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 5,
      "totalPages": 1
    }
  }
}
```

---

### 3. PATCH `/api/client/buyer/reviews/:id`
Cập nhật review

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**
```json
{
  "rating": 5,  // optional
  "comment": "..."  // optional
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Cập nhật review thành công",
  "data": {...}
}
```

**Lỗi:**
- `400`: Rating không hợp lệ, thiếu cả rating và comment
- `401`: Chưa đăng nhập
- `404`: Review không tồn tại hoặc không thuộc buyer

---

### 4. DELETE `/api/client/buyer/reviews/:id`
Xóa review

**Headers:**
```
Authorization: Bearer {token}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Xóa review thành công",
  "data": {...}
}
```

**Lỗi:**
- `401`: Chưa đăng nhập
- `404`: Review không tồn tại hoặc không thuộc buyer

---

## 🧪 Test Cases

### Test Cases thành công:
1. ✅ Tạo review cho property (có appointment accepted/completed)
2. ✅ Tạo review cho agent (có appointment accepted/completed)
3. ✅ Lấy danh sách reviews với pagination
4. ✅ Lọc reviews theo target_type
5. ✅ Lọc reviews theo rating
6. ✅ Cập nhật review của mình
7. ✅ Xóa review của mình

### Test Cases lỗi:
1. ❌ Không có token → 401
2. ❌ Token không hợp lệ → 401
3. ❌ Thiếu required fields → 400
4. ❌ Rating = 0 hoặc > 5 → 400
5. ❌ Target không tồn tại → 404
6. ❌ Duplicate review → 409
7. ❌ Không có tương tác thực → 403
8. ❌ Cập nhật review không phải của mình → 404
9. ❌ Xóa review không phải của mình → 404
10. ❌ Role không phải buyer → 403

---

## 💡 Tips

1. **Lấy reviewId tự động**: Sau khi tạo review thành công, copy `_id` từ response và paste vào variable `reviewId`

2. **Kiểm tra tương tác trước**: Đảm bảo buyer đã có appointment accepted/completed hoặc deal completed với target trước khi test tạo review

3. **Test duplicate**: Tạo review 2 lần với cùng `target_id` và `target_type` để test duplicate check

4. **Test pagination**: Thử với các giá trị `page` và `limit` khác nhau

5. **Test filter**: Kết hợp nhiều filter: `?target_type=property&rating=5&page=1&limit=10`

---

## 🔍 Debug

Nếu gặp lỗi, kiểm tra:
1. Server đã chạy chưa?
2. Token còn hợp lệ không?
3. Buyer có role = "buyer" không?
4. Target (property/agent) có tồn tại không?
5. Buyer có appointment accepted/completed hoặc deal completed với target không?
6. Đã review target này chưa? (duplicate check)

---

## 📝 Notes

- Tất cả API đều yêu cầu authentication (Bearer token)
- Chỉ buyer mới có thể tạo/xem/cập nhật/xóa reviews
- Mỗi buyer chỉ có thể review 1 lần cho mỗi target (unique composite index)
- Business rule: Chỉ cho phép review nếu có tương tác thực (appointment accepted/completed hoặc deal completed)

