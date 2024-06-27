import { useContext, useEffect, useState } from 'react';
import { Button } from './ui/button';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { GatewayContext } from '../pages/home';
import { motion } from 'framer-motion';

export function Files() {
  const firstFile = new File([],"");
  const [systemFile, setSystemFile] = useState<File>(firstFile);
  const [sduList, setSduList] = useState(['']);
  let context = useContext(GatewayContext);

  function handleFile(e: any) {
    if (e.target.files[0] === 'undefined') {
    } else {
      let file = e.target.files[0]
      setSystemFile(e.target.files[0]);

      if (file.name.charAt(8) === '3') {
        console.log('Arquivode sistema SDG');
        context.setCheck(true);
      }
      if (file.name.charAt(8) === '2') {
        console.log('Arquivo de sistema SD+');
        context.setCheck(false);
      }
    }
  }

  function sendFile(e: any) {
    e.preventDefault();

    const sduFilePath = systemFile.path;
    const sduFileName = systemFile.name;
    const sduFile = { filePath: sduFilePath, fileName: sduFileName };

    if (context.check === false) {
      window.electron.send('system-file', sduFile);

      window.electron.on('sdu-response', (sduListResponse: any) => {
        setSduList(sduListResponse);
      });

      setSystemFile(firstFile)
    }
    if (context.check === true) {
      window.electron.send('system-file-sdg', sduFile);

      window.electron.on('sdu-response-sdg', (sduListResponse: any) => {
        setSduList(sduListResponse);
      });
      setSystemFile(firstFile);
    }

  }

  useEffect(() => {
    if (context.check === false) {
      setSduList([]);
      
      window.electron.send('sdu-files', 'sdu-files');
    }
    if (context.check === true) {
      setSduList([]);
      
      window.electron.send('sdu-files-sdg', 'sdu-files');
    }

    window.electron.on('sdu-response', async (sduListResponse: any) => {
      await setSduList(sduListResponse);
    });

    window.electron.on('sdu-response-sdg', async (sduListResponse: any) => {
      await setSduList(sduListResponse);
    });
  }, [context.check, sduList]);

  return (
    <div className="text-slate-50 max-w-[800px] flex flex-col justify-center text-center">
      <h1 className="text-lg font-bold mb-5">
        {' '}
        Arquivos de atualização de sistemas do {context.check ? "SDG" : "SD+"}
      </h1>
      <form
        onSubmit={(e: any) => {
          sendFile(e);
        }}
      >
        <div className="mb-5">
          <label
            className="block mb-2 text-md rounded-md cursor-pointer pl-2 pr-2 pt-1 pb-1 bg-secondary text-slate-50"
            htmlFor="system-file"
          >
            Upload arquivo de sistema (.sdu)
          </label>
          <span className="text-slate-600 dark:text-slate-50">
            {`Arquivo: ${systemFile.name}`}
          </span>
          <input
            onInput={handleFile}
            accept=".sdu"
            type="file"
            id="system-file"
            className="hidden"
          />
        </div>

        <Button type="submit">Enviar</Button>
      </form>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">Arquivo</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {sduList.map((sduFile) => {
            return (
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                transition={{ type: 'spring', delay: 0.3, duration: 0.5 }}
                animate={{ y: 0, opacity: 100 }}
                className="flex w-full center justify-center border-b transition-color data-[state=selected]:bg-muted"
              >
                <TableRow>
                  <TableCell>{sduFile}</TableCell>
                </TableRow>
              </motion.div>
            );
          })}
        </TableBody>

        <TableFooter>Versão mais recente: {sduList.pop()}</TableFooter>

        <TableCaption>Lista de arquivos</TableCaption>
      </Table>
    </div>
  );
}
