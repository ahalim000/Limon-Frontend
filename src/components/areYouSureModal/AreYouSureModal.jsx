import { _ConversionFamilyId } from "convert";
import _ from "lodash";
import { useState, cloneElement } from "react";
import Modal from "react-modal";

export default function AreYouSureModal({
    children,
    messageText,
    acceptButtonText,
    rejectButtonText,
    acceptLogic,
    rejectLogic,
}) {
    if (!rejectButtonText) {
        rejectButtonText = "Cancel";
    }

    const customStyles = {
        content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
        },
    };
    let [modalIsOpen, setModalIsOpen] = useState(false);

    let childrenArray = null;
    if (_.isArray(children)) {
        childrenArray = children;
    } else {
        childrenArray = [children];
    }

    function openModal() {
        setModalIsOpen(true);
    }

    function closeModal() {
        setModalIsOpen(false);
    }

    function acceptClicked(event) {
        closeModal();
        if (acceptLogic) {
            acceptLogic(event);
        }
    }

    function rejectClicked() {
        closeModal();
        if (rejectLogic) {
            rejectLogic();
        }
    }

    return (
        <div>
            {_.map(childrenArray, (child, idx) =>
                cloneElement(child, { onClick: openModal, key: idx })
            )}
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Are You Sure Modal"
                ariaHideApp={false}
            >
                <div className="text-center">
                    <p className="text-lg mb-2">{messageText}</p>
                    <div className="flex justify-center">
                        <button
                            onClick={rejectClicked}
                            className="block border-2 border-solid border-black rounded-md w-48 p-1 mt-4 mb-2 mr-4 text-center font-bold bg-green-500 transition ease-in-out hover:opacity-50"
                        >
                            {rejectButtonText}
                        </button>
                        <button
                            onClick={acceptClicked}
                            className="block border-2 border-solid border-black rounded-md w-48 p-1 mt-4 mb-2 text-center font-bold bg-red-500 transition ease-in-out hover:opacity-50"
                        >
                            {acceptButtonText}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
