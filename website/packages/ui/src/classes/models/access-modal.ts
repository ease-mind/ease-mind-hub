import { AccessModalType } from "../enums/access-modal-type.enum";

export interface EasemindAccessModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    openModal: (type: AccessModalType) => void;
}