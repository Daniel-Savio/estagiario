import puppet, { Browser, PuppeteerNode }  from "puppeteer";

export class Bot
{

    readonly ip: string
    readonly credentials: {user: string, passwd: string}
    public process: any
    public mainPage: any


    constructor(ip: string, credentials: {user: string, passwd: string})
    {   
        this.ip = ip;
        this.credentials = credentials;

    }

    public async buildIntern(){
        this.process = await puppet.launch({
            headless: false,
            defaultViewport: {"width": 1950, "height": 1800},
        
        })
    }

    public async login(){
        try {
        this.mainPage = await this.process.newPage();
        await this.mainPage.goto(`http:\\${this.ip}/menu/home`);
        await this.mainPage.setViewport({width: 1920, height: 1080, deviceScaleFactor:1});
        await this.mainPage.click("#buttonEntrar.btn.btn-success");
        await this.mainPage.waitForSelector("#inputUsuario", {timeout: 5000});
        await this.mainPage.waitForTimeout(2000);
        await this.mainPage.type("#inputUsuario", this.credentials.user, {delay: 50})
        await this.mainPage.type("#inputSenha", this.credentials.passwd,  {delay: 50})
        await this.mainPage.click("#btn-submit")
        console.log(`terminei o SD+ ${this.ip}`)
        }catch(e: any) {

            console.log(`Não foi possivel conectar com o SD+ IP: ${this.ip}`)
            this.process.close();
            
        }
    }

    public async updateSystem(){
        await this.mainPage.waitForSelector(".panel-success", {timeout: 10000})
        await this.mainPage.goto(`http:\\${this.ip}/menu/atualizacao/`);
        await this.mainPage.click(".btn.btn-primary");
    }

}
