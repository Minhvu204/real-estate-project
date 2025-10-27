import { useEffect, useState } from "react";
import FormUpdateUser from "./FormUpdateUser";
import type { User } from "@/types/Users";
import { useParams } from "react-router-dom";

const UpdateUser = () => {
  const [user, setUser] = useState<User>();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const Role = ["admin", "agent", "seller", "buyer"];
  const { id } = useParams();

  useEffect(() => {
    fetch(`http://localhost:3000/api/admin/users/${id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data.data);
        setUser(data.data);
      });
  }, []);
  // console.log(id);

  const validateUpdateUser = () => {
    const newError: Record<string, string> = {};
    if (!user?.fullName?.trim()) {
      newError.fullName = "vui lòng nhập họ tên";
    }
    // if (!user?.phone?.trim()) {
    //   newError.phone = "vui lòng nhập số điện thoại";
    // } else if (!/^[0-9]{9,11}$/.test(user.phone)) {
    //   newError.phone = "Số điện thoại phải từ 9–11 số";
    // }
    setErrors(newError);
    return Object.keys(newError).length === 0;
  };

  const handleUpdate = async () => {
    if (!user) return;
    if (!validateUpdateUser()) return;
    try {
      const res = await fetch(`http://localhost:3000/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });
      if (res.ok) {
        alert("Cập nhật thành công!");
      } else {
        alert("Cập nhật thất bại!");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    console.log(e.target);
    setUser({ ...user!, [e.target.name]: e.target.value });
  };

  const handleBack = () => {
    window.history.back();
  };

  return (
    <>
      <FormUpdateUser
        user={user}
        errors={errors}
        Role={Role}
        handleUpdate={handleUpdate}
        handleBack={handleBack}
        handleChange={handleChange}
      />
    </>
  );
};

export default UpdateUser;
