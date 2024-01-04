<template>
    <div class="flex flex-wrap -mx-4" :class="{ 'justify-center items-center' : loadingProgress < 100 }">
        <Progress class="w-1/3" :model-value="loadingProgress" v-if="loadingProgress < 100"/>
        <template v-else>
            <div v-if="settings !== undefined" class="w-full flex flex-row">
                <Card class="border-none">
                    <CardContent class="grid gap-6 p-6 flex flex-row">
                        <NetworkConfig :settings="settings"/>
                        <PrinterConfig :settings="settings"/>
<!--                        <PrinterStatus :settings="settings"/>-->
<!--                        <LedConfig :settings="settings"/>-->
                    </CardContent>
                    <CardFooter class="justify-end">
                        <Button @click="saveSettings">Save All</Button>
                    </CardFooter>
                </Card>
            </div>
        </template>
    </div>
</template>

<script lang="ts">
import axios from 'axios'
import { Component, Vue, toNative } from "vue-facing-decorator";
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress'

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'

import NetworkConfig from '@/components/NetworkConfig.vue';
import PrinterConfig from '@/components/PrinterConfig.vue';
import PrinterStatus from '@/components/PrinterStatus.vue';
import LedConfig from '@/components/LedConfig.vue';
import { ISettings } from "@/interfaces/settings";
import { useToast } from '@/components/ui/toast/use-toast'

const { toast } = useToast();

const env = import.meta.env;

@Component( {
    components: { Button, NetworkConfig, Progress, PrinterConfig, PrinterStatus, LedConfig, Card, CardContent, CardDescription, CardHeader, CardFooter, CardTitle }
} )
class MainPage extends Vue {
    public settings: ISettings;
    public error: boolean = false;
    public loadingProgress: number = 0;
    private loadingTimer: number;

    async getSettings() {
        try {
            let result = await axios.get( `${ this.getOrigin() }/api/info` );

            console.log( result );

            if( result.status !== 200 ) {
                this.error = true;
            }
            else {
                this.loadSettings( result.data );
            }

            this.finishLoading();
        } catch( e ) {
            this.showToast(
                'Failed to reach controller',
                'Failed to fetch data from controller, please ensure everything is configured properly!',
                'destructive'
            );
        }
    }

    private loadSettings( settings: ISettings ) {
        this.settings = settings;
    }

    private getOrigin(): string {
        console.log( env );
        //@ts-ignore
        if( env.VITE_ENV === "development" )
            return "http://192.168.200.1";

        //@ts-ignore
        if( env.VITE_ENV === "staging" )
            return "http://bambu-controller";

        return window.location.origin;
    }

    private finishLoading() {
        clearInterval( this.loadingTimer );
        this.loadingProgress = 100;
    }

    private startLoading() {
        this.loadingProgress = 0;
        this.loadingTimer = setInterval( () => {
            if( this.loadingProgress > 90 )
                this.finishLoading();

            this.loadingProgress++;
        }, 100 );
    }

    mounted() {
        this.startLoading();
        this.getSettings();
    }

    async saveSettings() {
        await this.sendUpdateAsync();
        this.showToast( 'Settings Updated!', 'Settings have been updated, please reboot the device for the changes to take effect.', '' );
    }

    private async sendUpdateAsync() {
        await axios.post( `${ this.getOrigin() }/api/update`, this.settings, {
            headers: {
                'Content-Type': 'application/json'
            },
        } );
    }

    showToast( title: string, description: string, variant: string ) {
        //@ts-ignore
        toast( {
            title,
            description,
            variant
        } );
    }
}

export default toNative(MainPage);

</script>
