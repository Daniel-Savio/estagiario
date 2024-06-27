import { UpdateForm } from 'renderer/components/update-form';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../components/ui/tabs';
import { Files } from '../components/files';
import { Switch } from '../components/ui/switch';
import { createContext, useEffect, useState } from 'react';
import { useToast } from '../components/ui/use-toast';
import { Toaster } from '../components/ui/toaster';
export const GatewayContext = createContext<Check>({ check: false, setCheck: () =>{}});

export type Check = {
  check: boolean
  setCheck:(c: boolean) => void
};

export function Home() {
  const [gateway, setGateway] = useState<string>('SD+');
  const [check, setCheck] = useState<boolean>(false);
  const {toast} = useToast()

  function handleGatewaySelection() {
    setCheck(!check);
  }

  useEffect(() => {
    check ? setGateway('SDG') : setGateway('SD+');
    toast({
      title: "Gateway Alterado",
      description: `Alteado para ${check ? "SDG" : "SD+"}`
    });
  }, [check]);

  return (
    <GatewayContext.Provider value={{ check, setCheck }}>
      <div
        id="home"
        className="flex justify-center text-center center w-full relative"
      >
        <div className="flex flex-col ml-5 gap-3 text-gray-50 font-bold absolute left-5 ">
          <h1>SD+</h1>
          <Switch
            className="rotate-90"
            onClick={handleGatewaySelection}
            checked={check}
          ></Switch>
          <h1>SDG</h1>
        </div>
        <Tabs defaultValue="update" className="w-full rounded-none">
          <TabsList className="w-full flex gap-5 mt-5">
            <TabsTrigger value="update">Update</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
            <TabsTrigger value="osc">Oscilography</TabsTrigger>
            <TabsTrigger value="bm">BM</TabsTrigger>
          </TabsList>

          <TabsContent
            className="flex justify-center text-center"
            value="update"
          >
            <UpdateForm></UpdateForm>
          </TabsContent>

          <TabsContent
            className="flex justify-center text-center"
            value="files"
          >
            <Files></Files>
          </TabsContent>
        </Tabs>
      </div>
      <Toaster />
    </GatewayContext.Provider>
  );
}
