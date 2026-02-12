import { AccessModalType } from "../enums/access-modal-type.enum";

export interface EaseMindAccessModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    openModal: (type: AccessModalType) => void;
}