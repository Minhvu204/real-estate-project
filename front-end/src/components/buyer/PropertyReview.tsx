import {
  createPropertyReview,
  deleteReview,
  editReview,
  getAllReviewPropertyById,
} from "../../services/buyerService";
import type { Review } from "../../types/Review";
import { useEffect, useState } from "react";
import {
  Button,
  Rating,
  TextField,
  Typography,
  Box,
  Divider,
  Stack,
  Avatar,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { getUser } from "../../utils/storage";
import { toast } from "react-toastify";

interface PropsProperty {
  propertyId: string;
}

const PropertyReview = ({ propertyId }: PropsProperty) => {
  const [review, setReview] = useState<Review[]>([]);
  const [comment, setComment] = useState<string>("");
  const [rating, setRating] = useState<number | null>(0);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [canReview, setCanReview] = useState<boolean>(false);
  const [isComment, setIsComment] = useState<boolean>(false);
  const user = getUser();
  useEffect(() => {
    const fetchReview = async () => {
      const res = await getAllReviewPropertyById(propertyId);
      console.log(res);
      setReview(res.reviews);
      setCanReview(res.canReview);
      setIsComment(res.isCommented);
    };
    fetchReview();
  }, [propertyId]);

  useEffect(() => {
    if (user && user.id) {
      console.log(user.id);
      setCurrentUserId(user.id);
    }
  }, [user]);

  const handleComment = async () => {
    if (!rating) {
      return;
    } else if (canReview === false) {
      toast.error("bạn phải thuê hoặc mua để được comment");
      return;
    } else if (isComment === true && !editingReviewId) {
      toast.error("bạn chỉ được comment 1 lần");
      return;
    }
    const target_type = "property";

    try {
      if (editingReviewId) {
        await editReview(editingReviewId, rating, comment);
        setEditingReviewId(null);
        toast.success("edit comment thành công");
      } else {
        await createPropertyReview(propertyId, rating, comment, target_type);
        toast.success("comment thành công");
      }
      const res = await getAllReviewPropertyById(propertyId);
      setReview(res.reviews);
      setCanReview(res.canReview);
      setIsComment(res.isCommented);
      setComment("");
      setRating(0);
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteReview(id);
      const res = await getAllReviewPropertyById(propertyId);
      setReview(res.reviews);
      setCanReview(res.canReview);
      setIsComment(res.isCommented);
      toast.success("bạn đã xóa comment thành công");
    } catch (error) {
      toast.error("xóa comment thất bại");
      console.log("error: ", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingReviewId(null);
    setComment("");
    setRating(0);
  };

  const handleEdit = async (
    id: string,
    oldRating: number,
    oldComment: string
  ) => {
    setEditingReviewId(id);
    setRating(oldRating);
    setComment(oldComment);
    try {
      await editReview(id, rating!, comment);
      setComment("");
      setRating(0);
    } catch (err) {
      console.log("error: ", err);
    }
  };

  return (
    <Box sx={{ maxWidth: 640, margin: "0 auto" }}>
      <Typography variant="h6" align="center" gutterBottom fontWeight={700}>
        Đánh giá & Bình luận
      </Typography>
      <Box sx={{ mb: 2 }}>
        <TextField
          label="Nhập bình luận..."
          multiline
          minRows={3}
          fullWidth
          variant="outlined"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <Box sx={{ display: "flex", alignItems: "center", mt: 1, mb: 2 }}>
          <Typography sx={{ mr: 2 }}>Đánh giá:</Typography>
          <Rating
            name="property-rating"
            value={rating}
            onChange={(_, newValue) => setRating(newValue)}
          />
        </Box>
        <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleComment}
            disabled={!rating || comment.trim() === ""}
            sx={{ width: 120 }}
          >
            {editingReviewId ? "Cập nhật" : "Bình luận"}
          </Button>

          {editingReviewId && (
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleCancelEdit}
              sx={{ width: 120 }}
            >
              Hủy
            </Button>
          )}
        </Box>
      </Box>
      <Divider />
      <Typography variant="subtitle1" fontWeight={700} mb={2} mt={3}>
        comment
      </Typography>
      <Stack spacing={2}>
        {review?.map((item) => (
          <Box
            key={item._id}
            sx={{ p: 1, borderRadius: 2, background: "#fafafa" }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
              <Avatar
                alt={item.user_id.fullName}
                src={item.user_id.avatar}
                sx={{ mr: 2 }}
              />
              <Typography fontWeight={600} sx={{ mr: 2 }}>
                {item.user_id.fullName}
              </Typography>
              <Rating value={item.rating} readOnly size="small" />
              <Typography sx={{ ml: 2 }} color="text.secondary" fontSize={13}>
                {item.createdAt &&
                  new Date(item.createdAt).toLocaleDateString()}
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ ml: 7 }}>
              {item.comment}
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                mt: 1,
                gap: 1,
              }}
            >
              {currentUserId === item.user_id._id &&
                editingReviewId !== item._id && (
                  <>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() =>
                        handleEdit(item._id, item.rating, item.comment)
                      }
                      aria-label="edit"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(item._id)}
                      aria-label="delete"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </>
                )}
            </Box>
          </Box>
        ))}
        {review?.length === 0 && (
          <Typography color="text.secondary" align="center">
            Chưa có bình luận
          </Typography>
        )}
      </Stack>
    </Box>
  );
};

export default PropertyReview;
