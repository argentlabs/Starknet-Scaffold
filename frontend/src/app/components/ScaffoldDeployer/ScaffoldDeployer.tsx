"use client";
import cloudUploadIcon from "../../../../public/assets/cloudUploadIcon.svg";
import fileIcon from "../../../../public/assets/fileIcon.svg";
import trash from "../../../../public/assets/deleteIcon.svg";
import { useRef, useState, useMemo } from "react";
import Header from "../Header";
import Image from "next/image";
import { DeclareContractPayload, hash, json } from "starknet";
import { useAccount, useWaitForTransaction } from "@starknet-react/core";

interface FileList {
  lastModified: number;
  lastModifiedDate: Date;
  name: string;
  size: number;
  type: string;
  webkitRelativePath: string;
}

function ScaffoldDeployer() {
  const fileInputRef: any = useRef(null);
  const casmRef: any = useRef(null);
  const [selectedSierra, setSelectedSierra] = useState<FileList[]>([]);
  const [selectedCasm, setSelectedCasm] = useState<FileList[]>([]);
  const [classHash, setClassHash] = useState("");
  const [compiledClassHash, setCompiledClassHash] = useState("");
  const [contract, setContract] = useState<string | null>(null);
  const { account, status } = useAccount();

  const handleContractClassSelect = async (event: any) => {
    event.preventDefault();
    const files: any = Array.from(event.target.files);
    setSelectedSierra(files);

    if (!event.target.files) return;

    const fileAsString = files[0];
    const reader = new FileReader();

    reader.onload = function (event) {
      const fileContent = event.target?.result as string;

      if (!fileContent) return;
      setContract(json.parse(fileContent));

      const classHash = hash.computeContractClassHash(fileContent);
      setClassHash(classHash);
    };
    reader.readAsText(fileAsString); // Read file as text
  };

  const handleCompiledContractClassSelect = async (event: any) => {
    event.preventDefault();
    const files: any = Array.from(event.target.files);
    setSelectedCasm(files);

    if (!event.target.files) return;

    const fileAsString = files[0];
    const reader = new FileReader();

    reader.onload = function (event) {
      const fileContent = event.target?.result as string;

      if (!fileContent) return;
      setCompiledClassHash(json.parse(fileContent));
    };
    reader.readAsText(fileAsString); // Read file as text
  };

  const handleDeleteFile = (event: any) => {
    event.preventDefault();
    console.log("e: ", event)
    if (event.target.name == "casm") setSelectedCasm([]);
    if (event.target.name == "sierra") setSelectedSierra([]);
  };

  const handleDragOver = (event: any) => {
    event.preventDefault();
  };

  const handleDrop = (event: any) => {
    event.preventDefault();
    const files: any = Array.from(event.dataTransfer.files);
    // setSelectedFiles(files);
  };

  const handleDeclare = async (e: React.FormEvent) => {
    try {
      e.preventDefault();

      if (!contract) {
        throw new Error("No Sierra");
      }

      if (!compiledClassHash) {
        throw new Error("No CASM");
      }

      const payload: DeclareContractPayload = {
        contract,
        classHash,
        compiledClassHash,
      };

      let result;

      if (account && status == "connected") {
        result = await account.declare(payload);
        console.log(result);
      } else {
        throw new Error("Wallet not connected");
      }
      console.log("result: ", result);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex flex-col dark:text-white text-black">
      <Header />
      <div className="flex items-center flex-col p-4 pt-20">
        <form action="" className="flex flex-col">
          <h1 className="text-2xl font-bold">Declare</h1>

          {/*  */}
          {selectedSierra.length == 0 ? (
            <div
              className=" flex w-[600px] flex-col items-center rounded-[5px] border-[1px]  border-dashed border-[#333] bg-white pb-[90px] mb-5 mt-3 pt-[90px] text-center"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <Image src={cloudUploadIcon} className="mb-10" alt="" />
              <h2 className="mb-2  text-[22px] font-normal text-black">
                Input Contract Class JSON file (Sierra)
              </h2>
              <input
                type="file"
                name="sierra"
                onChange={async (e) => await handleContractClassSelect(e)}
                multiple
                style={{ display: "none" }}
                ref={fileInputRef}
              />
              <button
                onClick={(e) => {
                  e.preventDefault();
                  fileInputRef?.current.click();
                }}
                className="rounded-lg border-[1px] border-solid border-dark132 px-[57px] py-[16px] font-satoshi text-lg font-medium text-black"
              >
                Browse File
              </button>
            </div>
          ) : (
            <div className="bg-white flex items-center w-[600px] justify-between rounded-[20px] mt-3 mb-5 py-[16px] pl-8 pr-[52px]">
              <div className="flex items-center">
                <div className="relative flex h-[96px] w-[118px] justify-end">
                  <div className="absolute left-0 top-[40px] z-20 min-w-[70px] rounded-lg bg-[#2ECC71] px-[4.5px] py-[1.5px] text-center font-satoshi text-2xl font-medium text-white">
                    {selectedSierra?.at(0)?.name?.split(".")[1].toUpperCase()}
                  </div>
                  <Image src={fileIcon} className="" alt="file icon" />
                </div>
                <div>
                  <h3 className="mb-2 text-[22px] font-medium text-black">
                    {selectedSierra?.at(0)?.name.split(".")[0]}
                  </h3>
                </div>
              </div>
              <button onClick={handleDeleteFile} name="sierra">
                <Image src={trash} alt="trash icon" />
              </button>
            </div>
          )}

          {/*  */}
          {selectedCasm.length == 0 ? (
            <div
              className=" flex w-[600px] flex-col items-center rounded-[5px] border-[1px]  border-dashed border-[#333] bg-white pb-[90px] mb-5 mt-3 pt-[90px] text-center"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <Image src={cloudUploadIcon} className="mb-10" alt="" />
              <h2 className="mb-2  text-[22px] font-normal text-black">
                Input Compiled Contract Class JSON file (CASM)
              </h2>
              <input
                type="file"
                name="casm"
                onChange={async (e) =>
                  await handleCompiledContractClassSelect(e)
                }
                multiple
                style={{ display: "none" }}
                ref={casmRef}
              />
              <button
                onClick={(e) => {
                  e.preventDefault();
                  casmRef?.current.click();
                }}
                className="rounded-lg border-[1px] border-solid border-dark132 px-[57px] py-[16px] font-satoshi text-lg font-medium text-black"
              >
                Browse File
              </button>
            </div>
          ) : (
            <div className="bg-white flex items-center w-[600px] justify-between rounded-[20px] mt-3 mb-5 py-[16px] pl-8 pr-[52px]">
              <div className="flex items-center">
                <div className="relative flex h-[96px] w-[118px] justify-end">
                  <div className="absolute left-0 top-[40px] z-20 min-w-[70px] rounded-lg bg-[#2ECC71] px-[4.5px] py-[1.5px] text-center font-satoshi text-2xl font-medium text-white">
                    {selectedCasm?.at(0)?.name?.split(".")[1].toUpperCase()}
                  </div>
                  <Image src={fileIcon} className="" alt="file icon" />
                </div>
                <div>
                  <h3 className="mb-2 text-[22px] font-medium text-black">
                    {selectedCasm?.at(0)?.name.split(".")[0]}
                  </h3>
                </div>
              </div>
              <button onClick={handleDeleteFile} name="casm">
                <Image src={trash} alt="trash icon" />
              </button>
            </div>
          )}
          <button
            onClick={(e) => handleDeclare(e)}
            className="bg-blue-500 py-3 px-4 rounded-[5px] w-[200px] text-white"
          >
            Declare
          </button>
        </form>
        <form action="" className="flex flex-col mt-12">
          <h1 className="text-2xl font-bold">Deploy</h1>
          <input
            type="text"
            className="mt-4 mb-6 text-black p-3 rounded w-[600px]"
            placeholder="Input Class Hash"
          />
          <input
            type="text"
            className="mt-4 mb-6 text-black p-3 rounded w-[600px]"
            placeholder="Input Constructor Arguments"
          />
          <input
            type="text"
            className="mt-4 mb-6 text-black p-3 rounded w-[600px]"
            placeholder="Input Number of Constructor Arguments"
          />
          <button className="bg-blue-500 py-3 px-4 rounded-[5px] w-[200px] text-white">
            Deploy
          </button>
        </form>
      </div>
    </div>
  );
}

export default ScaffoldDeployer;
