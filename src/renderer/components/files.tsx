import { useEffect, useState } from "react";
import { Button } from "./ui/button";


export function Files() {
    const file = new File([''],"")
    const [systemFile, setSystemFile] = useState<File>(file);
    const [sduList, setSduList] = useState([''])

    function handleFile(e: any){
        console.log(e.target.files[0])
        if(e.target.files){
          setSystemFile(e.target.files[0])
          
          
        }else{
          setSystemFile(file)
        }
        if (e.target.files[0] === undefined) {
          setSystemFile(file)
        }
    
    }

    function sendFile(){
        if(systemFile !== file){
            const sduFilePath = systemFile.path
            const sduFileName = systemFile.name
            const sduFile = {filePath: sduFilePath, fileName: sduFileName}

            window.electron.send("system-file", sduFile)
        }
    }


    useEffect(() =>{
        window.electron.send("sdu-files", "sdu-files")
        window.electron.on("sdu-response", (sduListResponse: any)=>{
            console.log(sduListResponse)
            
        })
    }, [sduList])



  return (
    <div className="text-slate-50 max-w-[800px] flex flex-col justify-center text-center">
      <div className="mb-5">
        <label
          className="block mb-2 text-md rounded-md cursor-pointer pl-2 pr-2 pt-1 pb-1 bg-sky-600 text-slate-50"
          htmlFor="system-file"
        >
          Upload arquivo de sistema (.sdu)
        </label>
        <span className="text-slate-600 dark:text-slate-50">
          {' '}
          {`Arquivo: ${systemFile.name}`}{' '}
        </span>
        <input
          onChange={handleFile}
          accept=".sdu"
          type="file"
          id="system-file"
          className="hidden"
        />


      </div>

      <Button onClick={sendFile}>Enviar</Button>
    </div>
    
  );
}
