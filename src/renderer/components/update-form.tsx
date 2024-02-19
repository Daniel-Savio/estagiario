import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Table } from './ui/table';
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCaption,
  TableCell,
} from './ui/table';
import { Toaster } from './ui/toaster';
import { useToast } from './ui/use-toast';
const ipRegex1 = '(d+.d+.d+.d+):d{5}$';
const ipRegex2 = '(d+.d+.d+.d+)$';

export function UpdateForm() {
  const [sdp, setSdp] = useState<{ip: string, status: string}[]>([{'ip':'192.168.3.121', "status":"Aguradando"}]);
  const [ status, setStatus ] = useState<{ip: string, status: string}>();
  const { toast } = useToast();
  const inputIpRef = useRef<HTMLInputElement>(null);

  window.electron.on('status-message', (statusMessage: {ip: string, status: string})=>{setStatus(statusMessage)})

  function handleIp(e: any) {
    console.log(e.target.value);
  }

  function checkIp(array: {ip: string, status: string}[], ip: string) {
    let state = 0;
    array.forEach((value) => {
      if (value.ip === ip) {
        state++;
      }
    });

    if (state === 0) {
      return true;
    } else {
      return false;
    }
  }

  function addArray(): any {
    if (inputIpRef.current!.value) {
      if (checkIp(sdp, inputIpRef.current!.value) === false) {
        toast({
          variant: 'destructive',
          title: 'Natan Informa',
          description: 'Preencha com algum valor diferente de IP'
        });
      } else {
        
        setSdp((old) => {
          return [...old, {"ip":inputIpRef.current!.value, "status":"Aguardando"}];
        });
      }
    } else {
      toast({
        variant: 'destructive',
        title: 'Natan Informa',
        description: 'Preencha com algum valor de IP'
      });
    }
  }

  function removeAll() {
    setSdp([]);
  }

  function sendToUpdate() {
    console.log(sdp);
    if (!sdp.length) {
      toast({
        variant: 'destructive',
        title: 'Natan Informa',
        description: 'Natan avisa: Por favor, insira ao menos um IP e um arquivo de atualização .sdu'
      });

    } else {
      
      window.electron.send('system-update', sdp);

    }
  }

  useEffect(() => {

    window.electron.on('status-message', async (statusMessage: {ip: string, status: string})=>{
      console.log(statusMessage);
      let aux: any = sdp
      let index = 0
      for(let i =0; i < sdp.length; i++) {
        
        if(sdp[i].ip === statusMessage.ip){
          index = i
        }
      }
      
      aux[index] = statusMessage
      console.log("Aux:")
      console.log(aux)
  
      await setSdp(aux)
      console.log("SDP:")
      console.log(sdp)
  
    })

  },[sdp, status]);



  return (
    <div
      id="update-form"
      className="justify-center text-center m-b-10 dark:text-slate-50 h-fit w-fit"
    >
      <h1 className="text-lg font-bold mb-5"> Atualização de sistema do SD+</h1>

      <div className="mb-10 input-group justify-center align-bottom flex">
        <label
          htmlFor="ip-sdp"
          className="rounded-l-lg p-1 font-bold dark:text-slate-50 bg-secondary"
        >
          IP
        </label>

        <input
          ref={inputIpRef}
          onChange={handleIp}
          type="text"
          id="ip-sdp"
          placeholder="ex.: 192.168.3.121"
          className="text-slate-800 h-fit text-center p-1  bg-slate-200"
        />
        <button
          id="add-sdp-update"
          onClick={addArray}
          className=" p-1 rounded-r-lg font-bold text-slate-50  bg-primary b-round w-8"
        >
          +
        </button>
      </div>

      <Button variant={'destructive'} onClick={removeAll} className="m-2">
        {' '}
        Limpar lista{' '}
      </Button>

      <Button onClick={sendToUpdate} className="mb-2">
        {' '}
        Atualizar{' '}
      </Button>

      <Table className="bg-secondary rounded px-2">
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">IP</TableHead>
            <TableHead className="text-center">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sdp.map((sdp: {ip: string, status: string}, index: number) => {
            return (
              <TableRow key={index} className="border-background border-b-2">
                <TableCell className=" ">{sdp.ip}</TableCell>
                <TableCell>{sdp.status}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>

        <TableCaption>Lista de IPs</TableCaption>
      </Table>
      <Toaster></Toaster>
    </div>
  );
}
