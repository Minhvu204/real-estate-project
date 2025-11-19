import mongoose from "mongoose";
import Contract, {
  ContractStatus,
  ContractType,
  ContractUploaderRole,
  IContract,
} from "../models/contract.model";
import Deal, { DealStatus } from "../models/deal.model";

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

const BUYER_CONTRACT_ALLOWED_STATUSES: DealStatus[] = [
  "active",
  "awaiting_contract",
  "contract_under_review",
  "escrow_funded",
  "completed",
];
const BUYER_CONTRACT_UPLOADABLE_STATUSES: DealStatus[] = [
  "awaiting_contract",
  "contract_under_review",
];

const getLatestByDeal = async (dealId: string) => {
  if (!mongoose.Types.ObjectId.isValid(dealId)) return null;
  return Contract.findOne({
    deal_id: toObjectId(dealId),
    deleted: { $ne: true },
  }).sort({ version: -1 });
};

const getHistoryByDeal = async (dealId: string) => {
  if (!mongoose.Types.ObjectId.isValid(dealId)) return [];
  return Contract.find({
    deal_id: toObjectId(dealId),
    deleted: { $ne: true },
  }).sort({ version: -1 });
};

const createOrReplaceByDeal = async (params: CreateOrReplaceParams) => {
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

  const latest = await Contract.findOne({
    deal_id: dealObjectId,
    deleted: { $ne: true },
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
};

const deleteLatestByDeal = async (dealId: string) => {
  if (!mongoose.Types.ObjectId.isValid(dealId)) {
    const err: any = new Error("Invalid deal id");
    err.status = 400;
    throw err;
  }

  const latest = await Contract.findOne({
    deal_id: toObjectId(dealId),
    deleted: { $ne: true },
  }).sort({ version: -1 });

  if (!latest) {
    const err: any = new Error("No contract found for this deal");
    err.status = 404;
    throw err;
  }

  latest.deleted = true;
  latest.deleted_at = new Date();
  await latest.save();

  const nextContract = await Contract.findOne({
    deal_id: toObjectId(dealId),
    deleted: { $ne: true },
  }).sort({ version: -1 });

  if (nextContract && nextContract.status === "superseded") {
    nextContract.status = "submitted";
    nextContract.replaced_at = undefined;
    await nextContract.save();
  }

  return { deleted: true };
};

interface BuyerContractUploadParams {
  dealId: string;
  buyerId: string;
  fileUrl: string;
  originalFilename?: string;
  mimeType?: string;
  fileSize?: number;
  notes?: string;
}

const ensureBuyerDealAccess = async (
  dealId: string,
  buyerId: string,
  allowedStatuses: DealStatus[]
) => {
  if (!mongoose.Types.ObjectId.isValid(dealId) || !mongoose.Types.ObjectId.isValid(buyerId)) {
    const err: any = new Error("Invalid identifiers");
    err.status = 400;
    throw err;
  }

  const deal = await Deal.findOne({
    _id: toObjectId(dealId),
    buyer_id: toObjectId(buyerId),
  });

  if (!deal) {
    const err: any = new Error("Deal không tồn tại hoặc bạn không có quyền truy cập");
    err.status = 404;
    throw err;
  }

  if (!allowedStatuses.includes(deal.status as DealStatus)) {
    const err: any = new Error("Deal không ở trạng thái cho phép thao tác hợp đồng");
    err.status = 403;
    throw err;
  }

  return deal;
};

const getContractByDealForBuyer = async (dealId: string, buyerId: string) => {
  await ensureBuyerDealAccess(dealId, buyerId, BUYER_CONTRACT_ALLOWED_STATUSES);
  const contract = await getLatestByDeal(dealId);

  if (!contract) {
    const err: any = new Error("Chưa có hợp đồng cho deal này");
    err.status = 404;
    throw err;
  }

  return contract;
};

const createOrReplaceContractForBuyer = async (params: BuyerContractUploadParams) => {
  const { dealId, buyerId, fileUrl, originalFilename, mimeType, fileSize, notes } = params;

  await ensureBuyerDealAccess(dealId, buyerId, BUYER_CONTRACT_UPLOADABLE_STATUSES);

  return createOrReplaceByDeal({
    dealId,
    actorId: buyerId,
    actorRole: "buyer",
    fileUrl,
    originalFilename,
    mimeType,
    fileSize,
    contractType: "buyer_signed",
    status: "submitted",
    notes,
    allowReplace: true,
  });
};

interface BuyerContractListOptions {
  includeHistory?: boolean;
}

const getContractsForBuyer = async (
  buyerId: string,
  options: BuyerContractListOptions = {}
) => {
  const { includeHistory = false } = options;

  if (!mongoose.Types.ObjectId.isValid(buyerId)) {
    const err: any = new Error("Invalid buyer id");
    err.status = 400;
    throw err;
  }

  const deals = await Deal.find({
    buyer_id: toObjectId(buyerId),
    status: { $in: BUYER_CONTRACT_ALLOWED_STATUSES },
  })
    .populate("property_id")
    .populate("agent_id")
    .populate("seller_id")
    .lean();

  if (!deals.length) return [];

  const dealIds = deals.map((deal) => deal._id);
  const dealMap = new Map<string, typeof deals[number]>(
    deals.map((deal) => [deal._id.toString(), deal])
  );

  if (includeHistory) {
    const contracts = await Contract.find({
      deal_id: { $in: dealIds },
      deleted: { $ne: true },
    })
      .sort({ deal_id: 1, version: -1 })
      .lean();

    return contracts.map((contract) => ({
      contract,
      deal: dealMap.get(contract.deal_id.toString()),
    }));
  }

  const latestContracts = await Contract.aggregate([
    {
      $match: {
        deal_id: { $in: dealIds },
        deleted: { $ne: true },
      },
    },
    { $sort: { deal_id: 1, version: -1 } },
    {
      $group: {
        _id: "$deal_id",
        contract: { $first: "$$ROOT" },
      },
    },
  ]);

  return latestContracts.map(({ _id, contract }) => ({
    contract,
    deal: dealMap.get(_id.toString()),
  }));
};

const deleteContractById = async (contractId: string, dealId: string) => {
  if (!mongoose.Types.ObjectId.isValid(contractId) || !mongoose.Types.ObjectId.isValid(dealId)) {
    const err: any = new Error("Invalid identifiers");
    err.status = 400;
    throw err;
  }

  const contract = await Contract.findOne({
    _id: toObjectId(contractId),
    deal_id: toObjectId(dealId),
  });

  if (!contract) {
    const err: any = new Error("Hợp đồng không tồn tại hoặc đã bị xóa");
    err.status = 404;
    throw err;
  }

  await Contract.deleteOne({ _id: contract._id });

  return { deleted: true, contractId: contract._id, hardDelete: true };
};

export const contractService = {
  getLatestByDeal,
  getHistoryByDeal,
  createOrReplaceByDeal,
  deleteLatestByDeal,
  deleteContractById,
  getContractByDeal: getContractByDealForBuyer,
  createOrReplaceContract: createOrReplaceContractForBuyer,
  getContractsForBuyer,
};

