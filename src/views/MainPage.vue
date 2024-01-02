<template>
    <div class="flex flex-wrap -mx-4 h-full" :class="{ 'justify-center items-center' : loadingProgress < 100 }">
        <Progress class="w-1/3" :model-value="loadingProgress" v-if="loadingProgress < 100" />
        <template v-else>
            <div v-if="settings !== undefined" class="w-full flex flex-row">
                <div class="sm:w-1/2 md:w-1/4 lg:w-1/4 xl:w-1/4 p-4">
                    <NetworkConfig @save="onSaveNetwork" :settings="settings" />
                </div>
                <div class="sm:w-1/2 md:w-1/4 lg:w-1/4 xl:w-1/4 p-4">
                    <NetworkConfig :settings="settings" />
                </div>
            </div>
        </template>
    </div>
</template>

<script lang="ts">
import axios from 'axios'
import { Component, Vue } from "vue-facing-decorator";
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress'

import NetworkConfig from '@/components/NetworkConfig.vue';
import { ISettings } from "@/interfaces/settings";
import { useToast } from '@/components/ui/toast/use-toast'

const { toast } = useToast();

const env = await import.meta.env;

@Component({
    components: {Button, NetworkConfig, Progress}
})
export default class MainPage extends Vue {
    private settings : ISettings;
    private error : boolean = false;
    private loadingProgress : number = 0;
    private loadingTimer : number;

    async getSettings( ) {
        try {
            let result = await axios.get( `${ this.getOrigin() }/api/info`);

            console.log( result );

            if( result.status !== 200 ) {
                this.error = true;
            }
            else {
                this.loadSettings(result.data);
            }

            this.finishLoading();
        }
        catch( e ) {
            //@ts-ignore
            showToast(
                'Failed to reach controller',
                'Failed to fetch data from controller, please ensure everything is configured properly!',
                'destructive'
            );
        }
    }

    private loadSettings(settings : ISettings ) {
        this.settings = settings;
    }

    private getOrigin( ) : string {
        console.log( env );
        //@ts-ignore
        if( env.VITE_ENV === "development" )
            return "http://192.168.200.1";

        //@ts-ignore
        if( env.VITE_ENV === "staging" )
            return "http://bambu-controller";

        return window.location.origin;
    }

    private finishLoading( ) {
        clearInterval( this.loadingTimer );
        this.loadingProgress = 100;
    }

    private startLoading( ) {
        this.loadingProgress = 0;
        this.loadingTimer = setInterval( ( ) => {
            this.loadingProgress++;
        }, 100 );
    }

    mounted() {
        this.startLoading();
        this.getSettings();
    }

    private async onSaveNetwork( ) {
        await axios.post( `${ this.getOrigin() }/api/update`, this.settings, {
            headers: {
                'Content-Type': 'application/json'
            },
        } );

        this.showToast( 'Network Settings Updated!', 'Network settings have been updated, please reboot the device for the changes to take effect.', '' );
    }


    showToast(title : string, description : string, variant : string) {
        //@ts-ignore
        toast( {
            title,
            description,
            variant
        } );
    }
}

</script>
