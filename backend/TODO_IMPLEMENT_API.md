# 🚧 TODO: Implement Backend API

## ❌ Chưa implement

### 1. GET `/api/client/properties`
**Mục đích**: Lấy danh sách properties của user hiện tại (seller/agent)

**Hiện tại**: 
```javascript
router.get("", verifyToken, roleCheck("seller","agent"), (req, res) => {
  res.json({ message: "Lấy danh sách properties" }); // ❌ Mock only
});
```

**Cần implement**:
```javascript
// File: backend/src/controllers/client/common/property.controller.ts
export const getMyProperties = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user as { id: string };
    const properties = await propertyService.getPropertiesByUser(user.id);
    return successResponse(res, "Lấy danh sách bất động sản thành công", properties);
  } catch (error: any) {
    return errorResponse(res, error.message, error.status || 500);
  }
};

// File: backend/src/services/property.service.ts
async getPropertiesByUser(userId: string) {
  const properties = await Property.find({
    $or: [
      { owner_id: userId },
      { agent_id: userId }
    ],
    deleted: false
  })
    .populate("city_id", "city_name")
    .populate("type_id", "type_name")
    .populate("features", "feature_name")
    .sort({ createdAt: -1 });

  return properties;
}

// File: backend/src/routes/client/common/properties.route.ts
import { getMyProperties } from "../../../controllers/client/common/property.controller";

router.get("", verifyToken, roleCheck("seller","agent"), getMyProperties);
```

**Response format**:
```json
{
  "success": true,
  "message": "Lấy danh sách bất động sản thành công",
  "data": [
    {
      "_id": "...",
      "title": "...",
      "price": 1000000,
      "address": "...",
      "city_id": { "_id": "...", "city_name": "..." },
      "type_id": { "_id": "...", "type_name": "..." },
      "features": [{ "_id": "...", "feature_name": "..." }],
      "images": ["..."],
      "status": "available",
      "bedrooms": 3,
      "bathrooms": 2
    }
  ]
}
```

---

## ✅ Đã có implement

- ✅ PATCH `/api/client/properties/:id` - Update property
- ✅ DELETE `/api/client/properties/:id` - Soft delete property

---

## 📝 Notes

- Front-end đã sẵn sàng và đang chờ backend implement
- Hiện tại front-end sẽ hiển thị empty state khi API trả về lỗi
- User sẽ thấy thông báo: "Backend chưa implement GET /api/client/properties"

