import puppet from 'puppeteer';
import { BrowserWindow } from 'electron';


export class Bot {
  readonly ip: string;
  readonly credentials: { user: string; passwd: string };
  readonly frontEnd: BrowserWindow;
  public process: any;
  public mainPage: any;

  constructor(ip: string, credentials: { user: string; passwd: string }, frontEnd: BrowserWindow) {
    this.ip = ip;
    this.credentials = credentials;
    this.frontEnd = frontEnd;
  }

  public async buildIntern() {
    this.process = await puppet.launch({
      headless: false,
      defaultViewport: { width: 1950, height: 1800 },
    });
    return {ip: this.ip, status: "Inicializando"}
  }

  public async login() {
    try {
      this.mainPage = await this.process.newPage();
      await this.mainPage.goto(`http:\\${this.ip}/menu/home`);
      await this.mainPage.setViewport({
        width: 1920,
        height: 1080,
        deviceScaleFactor: 1,
      });
      await this.mainPage.click('#buttonEntrar.btn.btn-success');
      await this.mainPage.waitForSelector('#inputUsuario', { timeout: 5000 });
      await this.mainPage.waitForTimeout(2000);
      await this.mainPage.type('#inputUsuario', this.credentials.user, {
        delay: 50,
      });
      await this.mainPage.type('#inputSenha', this.credentials.passwd, {
        delay: 50,
      });
      await this.mainPage.click('#btn-submit');
      
      return {ip: this.ip, status: "Logado no IED"}
    } catch (e: any) {
      
      this.process.close();
      return {ip: this.ip, status: "Não foi possível conectar ao IED"}
    }
  }

  public async updateSystem(fileName: string) {
    const fileVersion = fileName.substring(-4);
    console.log(fileName);
    await this.mainPage.waitForTimeout(2000);
    await this.frontEnd.webContents.send("status-message", {ip: this.ip, status: "Validando versão de sistema"})

    
    await this.mainPage.waitForSelector('.li_atualizacao ', { timeout: 10000 });
    await this.mainPage.goto(`http:\\${this.ip}/menu/sobre/`);
    await this.mainPage.waitForTimeout(2000);
    const sdVersion = await this.mainPage.evaluate(() => {
      return document
        .querySelector('h6')
        ?.textContent?.substring(-6)
        .replaceAll('.', '')
        .replace('Versão: ', '');
    });

    if (fileVersion >= sdVersion) {
      await this.frontEnd.webContents.send("status-message", {ip: this.ip, status: "Iniciando update de sistema"})

      const filePath = __dirname + '/archive/sduFiles/' + fileName;
      await this.mainPage.waitForTimeout(500);
      await this.mainPage.goto(`http:\\${this.ip}/menu/atualizacao/`);
      await this.mainPage.waitForSelector('#upload-file');
      const inputElement = await this.mainPage.$('#upload-file');
      inputElement.uploadFile(filePath);
      await this.mainPage.waitForTimeout(1000);
      await this.mainPage.click('#btn-update');
      await this.mainPage.waitForSelector('#modalBotaoSim', {
        setTimeout: 2000,
      });
      await this.frontEnd.webContents.send("status-message", {ip: this.ip, status: "Enviando arquivos"})
      this.mainPage.click("#modalBotaoSim");
      await this.mainPage.evaluate(async () =>{
        const yesButton = await document.querySelector('#modalBotaoSim')
        if (yesButton!){
          
          yesButton.click()
        }
        
      }
      );
      await this.mainPage.waitForSelector('.alert-success', {setTimeout: 60000})
      await this.frontEnd.webContents.send("status-message", {ip: this.ip, status: "Arquivos enviados com sucesso"})
      
      await this.mainPage.waitForSelector('.toast-success', {setTimeout: 300000})


      await this.frontEnd.webContents.send("status-message", {ip: this.ip, status: "Arquivos aceitos"})
      
      await this.mainPage.goto(`http:\\${this.ip}/wait`);
      await this.mainPage.waitForSelector("#progress-bar-atualizacao", {setTimeout: 60000})

      await this.frontEnd.webContents.send("status-message", {ip: this.ip, status: "Atualizando!"})


 

      
    } else
    await this.frontEnd.webContents.send("status-message", {ip: this.ip, status: `Versão solicitada menor do que a já presente no IED ${sdVersion}`})
  }

  public async oscDowload(){

  }

  public async accessConfigurationArea(){
    await this.mainPage.goto(`http:\\${this.ip}/menu/configuracao/`);
  }
}
