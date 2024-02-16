import { UpdateForm } from 'renderer/components/update-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {Files} from '../components/files';

export function Home() {
  return (
    <div id="home" className="flex justify-center text-center w-full">
      <Tabs defaultValue="natan" className="w-full rounded-none">
        <TabsList>
          <TabsTrigger value="natan">Natan</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
        </TabsList>

        <TabsContent className='flex justify-center text-center' value="natan">
          <UpdateForm></UpdateForm>
        </TabsContent>

        <TabsContent className='flex justify-center text-center' value="files">
          <Files></Files>
        </TabsContent>
      </Tabs>

      
    </div>
  );
}
