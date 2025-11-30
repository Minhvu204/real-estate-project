import {
  createPropertyReview,
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
} from "@mui/material";

interface PropsProperty {
  propertyId: string;
}

const PropertyReview = ({ propertyId }: PropsProperty) => {
  const [review, setReview] = useState<Review[]>([]);
  const [comment, setComment] = useState<string>("");
  const [rating, setRating] = useState<number | null>(0);

  useEffect(() => {
    const fetchReview = async () => {
      const res = await getAllReviewPropertyById(propertyId);
      setReview(res);
    };
    fetchReview();
  }, [propertyId]);

  const handleComment = async () => {
    if (!rating) return;
    const target_type = "property";
    try {
      await createPropertyReview(propertyId, rating, comment, target_type);
      const res = await getAllReviewPropertyById(propertyId);
      setReview(res);
      setComment("");
      setRating(0);
    } catch (error) {
      console.log("ko comment dc: ", error);
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
        <Button
          variant="contained"
          color="primary"
          onClick={handleComment}
          disabled={!rating || comment.trim() === ""}
          sx={{ mt: 1, width: 120, alignSelf: "flex-end" }}
        >
          Gửi
        </Button>
      </Box>
      <Divider />
      <Typography variant="subtitle1" fontWeight={700} mb={2} mt={3}>
        Các bình luận đã có
      </Typography>
      <Stack spacing={2}>
        {review?.map((item) => (
          <Box
            key={item._id}
            sx={{ p: 1, borderRadius: 2, background: "#fafafa" }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
              <Typography fontWeight={600} sx={{ mr: 2 }}>
                {item.user_id.fullName}
              </Typography>
              <Rating value={item.rating} readOnly size="small" />
              <Typography sx={{ ml: 2 }} color="text.secondary" fontSize={13}>
                {item.createdAt &&
                  new Date(item.createdAt).toLocaleDateString()}
              </Typography>
            </Box>
            <Typography variant="body2">{item.comment}</Typography>
          </Box>
        ))}
        {review?.length === 0 && (
          <Typography color="text.secondary" align="center">
            Chưa có bình luận nào.
          </Typography>
        )}
      </Stack>
    </Box>
  );
};

export default PropertyReview;
