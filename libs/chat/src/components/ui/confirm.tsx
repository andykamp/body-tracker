import { ReactNode } from "react";
import { Modal, ModalProps } from '@geist-ui/core'

export type ConfirmProps = ModalProps & {
  shown: boolean
  title: string
  content: ReactNode
  onConfirmText?: ReactNode
  onConfirmDisabled?: boolean
  onConfirm: () => void,
  onCloseText?: ReactNode
  onClose: () => void,
  children: ReactNode
}

function Confirm(props: ConfirmProps) {
  const {
    shown,
    title,
    content,
    onConfirmText = 'Submit',
    onConfirmDisabled = false,
    onConfirm,
    onCloseText = "Cancel",
    onClose,
    children,
    ...modalProps
  } = props

  return (
    <>
      {children}
      <Modal
        visible={shown}
        onClose={onClose}
        {...modalProps}
      >
        <Modal.Title>{title}</Modal.Title>
        <Modal.Content>
          {content}
        </Modal.Content>
        <Modal.Action
          passive
          onClick={onClose}
        >
          {onCloseText}
        </Modal.Action>
        <Modal.Action
          disabled={onConfirmDisabled}
          onClick={onConfirm}
        >
          {onConfirmText}
        </Modal.Action>
      </Modal>
    </>
  )
}

export default Confirm;


