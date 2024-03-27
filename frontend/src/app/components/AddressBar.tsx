"use client";
import {
  useAccount,
  useDisconnect,
  useStarkProfile,
} from "@starknet-react/core";
import Blockies from "react-blockies";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import GenericModal from "./GenericModal";

export const UserModal = ({
  openConnectedModal,
  address,
  closeConnectedModal,
}: {
  openConnectedModal: boolean;
  address: string;
  closeConnectedModal: () => void;
}) => {
  const [animate, setAnimate] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const { data: starkProfile } = useStarkProfile({
    address,
  });

  const closeModal = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setAnimate(false);
    setTimeout(() => {
      closeConnectedModal();
    }, 400);
  };

  useEffect(() => {
    if (openConnectedModal) {
      setAnimate(true);
    } else {
      setAnimate(false);
    }
  }, [openConnectedModal]);

  useEffect(() => {
    const id = setTimeout(() => {
      setIsCopied(false);
    }, 1500);

    return () => clearTimeout(id);
  }, [isCopied]);

  function handleCopyClick() {
    if (!address) return;
    navigator.clipboard.writeText(starkProfile?.name || address);
    setIsCopied(true);
  }

  const { disconnect } = useDisconnect();

  return (
    <GenericModal
      isOpen={openConnectedModal}
      onClose={closeModal}
      animate={animate}
      className={`w-[80vw] h-[60vh] mx-auto md:w-[25rem] md:h-[30rem]  text-white `}
    >
      <div className="flex flex-col items-center justify-center h-full w-full">
        <div className="flex h-[80%] w-[80%] flex-col items-center justify-evenly">
          {starkProfile?.profilePicture ? (
            <img
              src={starkProfile?.profilePicture}
              className="rounded-full h-[120px] w-[120px] mr-2"
              alt="starknet profile"
            />
          ) : (
            <Blockies
              seed={address}
              scale={15}
              className="rounded-full h-24 w-24"
            />
          )}
          <span className="flex justify-between p-3 border-[1px] border-outline-gray rounded-full w-full">
            <span className="flex justify-center">
              {starkProfile?.name ||
                address?.slice(0, 12).concat("...").concat(address?.slice(-5))}
            </span>
            <Image
              onClick={handleCopyClick}
              className="border-l-[1px] border-outline-grey border-solid pl-1 cursor-pointer"
              src={isCopied ? "/assets/tick.svg" : "/assets/copy.svg"}
              width={20}
              height={20}
              alt="#"
            />
          </span>
          <button
            onClick={(e) => {
              closeModal(e);
              disconnect();
              e.stopPropagation();
            }}
            className="p-3 w-full rounded-lg bg-blue-500  "
          >
            Disconnect
          </button>
        </div>
      </div>
    </GenericModal>
  );
};

const AddressBar = ({
  setOpenConnectedModal,
}: {
  setOpenConnectedModal: Dispatch<SetStateAction<boolean>>;
}) => {
  const { address } = useAccount();
  const { data: starkProfile } = useStarkProfile({
    address,
  });

  const toggleModal = () => {
    setOpenConnectedModal((prev) => !prev);
  };

  if (!address) {
    return null;
  }

  return (
    <button
      onClick={toggleModal}
      className="bg-blue-500 py-2 px-4 text-white rounded-full transition duration-300"
    >
      {
        <span className="flex items-center">
          {starkProfile?.profilePicture ? (
            <img
              src={starkProfile?.profilePicture}
              className="rounded-full h-8 w-8 mr-2"
              alt="starknet profile"
            />
          ) : (
            <Blockies seed={address} className="rounded-full h-8 w-8 mr-2" />
          )}
          {starkProfile?.name
            ? starkProfile.name
            : address?.slice(0, 6).concat("...").concat(address?.slice(-5))}
        </span>
      }
    </button>
  );
};

export default AddressBar;
