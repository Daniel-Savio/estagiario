import puppet, { Browser, PuppeteerNode } from "puppeteer";

export class Bot {

    readonly ip: string
    readonly credentials: { user: string, passwd: string }
    public process: any
    public mainPage: any


    constructor(ip: string, credentials: { user: string, passwd: string }) {
        this.ip = ip;
        this.credentials = credentials;

    }

    public async buildIntern() {
        this.process = await puppet.launch({
            headless: false,
            defaultViewport: { "width": 1950, "height": 1800 },

        })
    }

    public async login() {
        try {
            this.mainPage = await this.process.newPage();
            await this.mainPage.goto(`http:\\${this.ip}/menu/home`);
            await this.mainPage.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
            await this.mainPage.click("#buttonEntrar.btn.btn-success");
            await this.mainPage.waitForSelector("#inputUsuario", { timeout: 5000 });
            await this.mainPage.waitForTimeout(2000);
            await this.mainPage.type("#inputUsuario", this.credentials.user, { delay: 50 })
            await this.mainPage.type("#inputSenha", this.credentials.passwd, { delay: 50 })
            await this.mainPage.click("#btn-submit")
            console.log(`Consegui acessar o SD+ ${this.ip}`)
        } catch (e: any) {

            console.log(`Não foi possivel conectar com o SD+ IP: ${this.ip}`)
            this.process.close();

        }
    }

    public async updateSystem(fileName: string) {
        const fileVersion = fileName.substring(-4);
        console.log(fileName);
        await this.mainPage.waitForTimeout(2000);
        await this.mainPage.waitForSelector(".panel-success", { timeout: 10000 })
        await this.mainPage.goto(`http:\\${this.ip}/menu/sobre/`);
        await this.mainPage.waitForTimeout(2000);
        const sdVersion = await this.mainPage.evaluate(() => {
            return document.querySelector('h6')?.textContent?.substring(-6).replaceAll(".", "").replace("Versão: ", "")
        })

        if (fileName >= sdVersion) {
            console.log(`Iniciando o update do IED ${this.ip}: \n De: ${sdVersion} para: ${fileVersion}`)
            const filePath = __dirname +"/archive/sduFiles/" + fileName
            await this.mainPage.waitForTimeout(500);
            await this.mainPage.goto(`http:\\${this.ip}/menu/atualizacao/`);
            await this.mainPage.waitForSelector("#upload-file")
            const inpuElement = await this.mainPage.$("#upload-file")
            inpuElement.uploadFile(filePath)
            await this.mainPage.waitForTimeout(1000);
            await this.mainPage.click("#btn-update");
            await this.mainPage.waitForSelector("#modalBotaoSim")
            await this.mainPage.click("#modalBotaoSim")


        }
        else (
            console.log(`Versão solicitada: ${fileVersion} é menor do que a já presente no IED ${this.ip} ---- ${sdVersion}`)
        )

    }

}
