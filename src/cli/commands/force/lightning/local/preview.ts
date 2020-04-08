#!/usr/bin/env ts-node
import { flags, SfdxCommand } from '@salesforce/command';
import { Logger, Messages } from '@salesforce/core';
import Setup from './setup';

// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages('@salesforce/lwc-dev-mobile', 'preview');

export default class Preview extends SfdxCommand {
    public static description = messages.getMessage('commandDescription');

    public static examples = [
        `$ sfdx force:lightning:lwc:preview -p iOS -t LWCSim2 -f http://localhost:3333`,
        `$ sfdx force:lightning:lwc:preview -p Android -t LWCEmu2 -f http://localhost:3333`
    ];

    public static args = [{ name: 'file' }];

    protected static flagsConfig = {
        // flag with a value (-n, --name=VALUE)
        platform: flags.string({
            char: 'p',
            description: messages.getMessage('platformFlagDescription')
        }),
        path: flags.string({
            char: 'd',
            description: messages.getMessage('pathFlagDescription')
        }),
        target: flags.string({
            char: 't',
            description: messages.getMessage('targetFlagDescription')
        })
    };

    // Comment this out if your command does not require an org username
    protected static requiresUsername = false;

    // Comment this out if your command does not support a hub org username
    protected static supportsDevhubUsername = false;

    // Set this to true if your command requires a project workspace; 'requiresProject' is false by default
    protected static requiresProject = false;

    public async init(): Promise<void> {
        const logger = await Logger.child('mobile:preview', { tag: 'value' });
        this.logger = logger;
        return super.init();
    }

    public async run(): Promise<any> {
        this.logger.info('Preview Command called');
        await Setup.run(['-p', this.flags.platform]);
        this.logger.info('Preview Command ended');
        this.validateComponentPathValue(this.flags.path);
        this.validateTargetValue(this.flags.target);
    }

    public validateComponentPathValue(path: string): boolean {
        this.logger.debug('Invoked validate validateComponent in preview');
        return true;
    }

    public validateTargetValue(target: string): boolean {
        this.logger.debug('Invoked validate validateTargetValue in preview');
        return true;
    }
}
