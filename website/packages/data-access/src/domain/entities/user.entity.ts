export interface UserEntity {
  _id: string;
  name: string;
  email: string;
  document?: string;
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserAddress {
  address: string;
  city: string;
  state: string;
  complement?: string;
}
