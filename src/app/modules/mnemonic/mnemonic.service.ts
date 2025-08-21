import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { IMnemonicFilterables, IMnemonic } from './mnemonic.interface';
import { Mnemonic } from './mnemonic.model';
import { JwtPayload } from 'jsonwebtoken';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { paginationHelper } from '../../../helpers/paginationHelper';
import { mnemonicSearchableFields } from './mnemonic.constants';
import { Types } from 'mongoose';


const createMnemonic = async (
  user: JwtPayload,
  payload: IMnemonic
): Promise<IMnemonic> => {
  try {
    const result = await Mnemonic.create(payload);
    if (!result) {
      
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'Failed to create Mnemonic, please try again with valid data.'
      );
    }

    return result;
  } catch (error: any) {
    
    if (error.code === 11000) {
      throw new ApiError(StatusCodes.CONFLICT, 'Duplicate entry found');
    }
    throw error;
  }
};

const getAllMnemonics = async (
  user: JwtPayload,
  filterables: IMnemonicFilterables,
  pagination: IPaginationOptions
) => {
  const { searchTerm, ...filterData } = filterables;
  const { page, skip, limit, sortBy, sortOrder } = paginationHelper.calculatePagination(pagination);

  const andConditions = [];

  // Search functionality
  if (searchTerm) {
    andConditions.push({
      $or: mnemonicSearchableFields.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    });
  }

  // Filter functionality
  if (Object.keys(filterData).length) {
    andConditions.push({
      $and: Object.entries(filterData).map(([key, value]) => ({
        [key]: value,
      })),
    });
  }

  const whereConditions = andConditions.length ? { $and: andConditions } : {};

  const [result, total] = await Promise.all([
    Mnemonic
      .find(whereConditions)
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder }),
    Mnemonic.countDocuments(whereConditions),
  ]);

  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    data: result,
  };
};

const getSingleMnemonic = async (id: string): Promise<IMnemonic> => {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid Mnemonic ID');
  }

  const result = await Mnemonic.findById(id);
  if (!result) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Requested mnemonic not found, please try again with valid id'
    );
  }

  return result;
};

const updateMnemonic = async (
  id: string,
  payload: Partial<IMnemonic>
): Promise<IMnemonic | null> => {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid Mnemonic ID');
  }

  const result = await Mnemonic.findByIdAndUpdate(
    new Types.ObjectId(id),
    { $set: payload },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!result) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Requested mnemonic not found, please try again with valid id'
    );
  }

  return result;
};

const deleteMnemonic = async (id: string): Promise<IMnemonic> => {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid Mnemonic ID');
  }

  const result = await Mnemonic.findByIdAndDelete(id);
  if (!result) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Something went wrong while deleting mnemonic, please try again with valid id.'
    );
  }

  return result;
};

export const MnemonicServices = {
  createMnemonic,
  getAllMnemonics,
  getSingleMnemonic,
  updateMnemonic,
  deleteMnemonic,
};