import React, { useState, useRef, useEffect } from 'react';
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
  const [sdp, setSdp] = useState<string[]>(['192.168.3.121']);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const { toast } = useToast();

  const inputIpRef = useRef<HTMLInputElement>(null);
  const ipErrorRef = useRef('null');

  function handleIp(e: any) {
    console.log(e.target.value);
  }

  function checkIp(array: string[], ip: string) {
    let state = 0;
    array.forEach((value) => {
      if (value === ip) {
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
          return [...old, inputIpRef.current!.value];
        });
      }
    } else {
      toast({
        variant: 'destructive',
        title: 'Natan Informa',
        description: 'Preencha com algum valor de IP'
      });
      ipErrorRef.current! = errorMessage;
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
      
      window.electron.send('system-update', { ipList: sdp });
    }
  }


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
          {sdp.map((ip: string, index: number) => {
            return (
              <TableRow key={index} className="border-background border-b-2">
                <TableCell className=" ">{ip}</TableCell>
                <TableCell>status</TableCell>
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
