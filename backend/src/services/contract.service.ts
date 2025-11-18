import mongoose from "mongoose";
import Contract, {
  ContractStatus,
  ContractType,
  ContractUploaderRole,
  IContract,
} from "../models/contract.model";

const toObjectId = (id: string) => new mongoose.Types.ObjectId(id);

interface CreateOrReplaceParams {
  dealId: string;
  actorId: string;
  actorRole: ContractUploaderRole;
  fileUrl: string;
  originalFilename?: string;
  mimeType?: string;
  fileSize?: number;
  contractType?: ContractType;
  status?: ContractStatus;
  notes?: string;
  allowReplace?: boolean;
}

export const contractService = {
  async getLatestByDeal(dealId: string) {
    if (!mongoose.Types.ObjectId.isValid(dealId)) return null;
    return Contract.findOne({
      deal_id: toObjectId(dealId),
      deleted: { $ne: true } // Chỉ lấy contract chưa bị xóa
    }).sort({ version: -1 });
  },

  async getHistoryByDeal(dealId: string) {
    if (!mongoose.Types.ObjectId.isValid(dealId)) return [];
    return Contract.find({
      deal_id: toObjectId(dealId),
      deleted: { $ne: true } // Chỉ lấy contract chưa bị xóa
    }).sort({ version: -1 });
  },

  async createOrReplaceByDeal(params: CreateOrReplaceParams) {
    const {
      dealId,
      actorId,
      actorRole,
      fileUrl,
      originalFilename,
      mimeType,
      fileSize,
      contractType,
      status = "submitted",
      notes,
      allowReplace = false,
    } = params;

    if (!mongoose.Types.ObjectId.isValid(dealId) || !mongoose.Types.ObjectId.isValid(actorId)) {
      const err: any = new Error("Invalid identifiers");
      err.status = 400;
      throw err;
    }

    const dealObjectId = toObjectId(dealId);
    const actorObjectId = toObjectId(actorId);

    // Tìm contract mới nhất chưa bị xóa
    const latest = await Contract.findOne({
      deal_id: dealObjectId,
      deleted: { $ne: true }
    }).sort({ version: -1 });

    if (!allowReplace && latest && latest.status !== "superseded") {
      const err: any = new Error("Contract already exists for this deal. Use replace endpoint.");
      err.status = 409;
      throw err;
    }

    const nextVersion = (latest?.version ?? 0) + 1;

    if (latest && latest.status !== "superseded") {
      latest.status = "superseded";
      latest.replaced_at = new Date();
      await latest.save();
    }

    const contract = await Contract.create({
      deal_id: dealObjectId,
      file_url: fileUrl,
      version: nextVersion,
      uploaded_by: actorObjectId,
      role_of_uploader: actorRole,
      original_filename: originalFilename,
      mime_type: mimeType,
      file_size: fileSize,
      contract_type: contractType || "initial",
      status,
      notes,
    });

    return contract;
  },

  async deleteLatestByDeal(dealId: string) {
    if (!mongoose.Types.ObjectId.isValid(dealId)) {
      const err: any = new Error("Invalid deal id");
      err.status = 400;
      throw err;
    }

    // Tìm contract mới nhất chưa bị xóa
    const latest = await Contract.findOne({
      deal_id: toObjectId(dealId),
      deleted: { $ne: true }
    }).sort({ version: -1 });

    if (!latest) {
      const err: any = new Error("No contract found for this deal");
      err.status = 404;
      throw err;
    }

    await Contract.deleteOne({ _id: latest._id });

    // // Tìm contract tiếp theo chưa bị xóa (nếu có)
    // const nextContract = await Contract.findOne({
    //   deal_id: toObjectId(dealId),
    //   deleted: { $ne: true }
    // }).sort({ version: -1 });

    // // Nếu còn contract khác và đang bị "superseded", restore về "submitted"
    // if (nextContract && nextContract.status === "superseded") {
    //   nextContract.status = "submitted";
    //   nextContract.replaced_at = undefined;
    //   await nextContract.save();
    // }

    return { deleted: true };
  },
};

