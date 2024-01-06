<template>
    <div class="flex flex-col w-screen h-screen">
        <header class="body-font border-b border-primary-300 mb-8 flex flex-row items-center">
            <div class="flex flex-wrap basis-1/5 p-5 flex-col md:flex-row">
                <a class="flex title-font font-medium mb-4 md:mb-0">
                    <h1 class="ml-3 text-4xl">Bambu Controller</h1>
                </a>
            </div>
            <div class="flex flex-wrap basis-1/5 p-5 flex-col justify-evenly md:flex-row">
                <Button :disabled="isLoading"
                        class="flex text-l items-center justify-center h-8"
                        @click="reboot">
                    <Loader2 class="animate-spin" v-if="isLoading"/>
                    <template v-else>Reboot</template>
                </Button>
                <Button :disabled="isLoading"
                        class="flex text-l items-center justify-center h-8"
                        @click="reboot">
                    <Loader2 class="animate-spin" v-if="isLoading"/>
                    <template v-else>Factory Reset</template>
                </Button>
            </div>

        </header>
        <RouterView />
        <Toaster/>
    </div>
</template>

<script lang="ts">
import { RouterView } from 'vue-router';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-vue-next';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import { Component, Vue, toNative } from "vue-facing-decorator";

import Toaster from '@/components/ui/toast/Toaster.vue'
import { useToast } from '@/components/ui/toast/use-toast'

const { toast } = useToast();

const env = import.meta.env;

const timeout = (ms : number) =>
    new Promise(resolve => {
        setTimeout(resolve, ms)
    });

@Component({
    components: { Button, Loader2, Toaster, TooltipProvider, Tooltip, TooltipTrigger, TooltipContent }
})
class App extends Vue {

    public isLoading: boolean = false;
    public ws: WebSocket | null = null;
    private wsInterval: number | null = null;
    public shouldReloadOnConnect: boolean = false;
    private wsRetryDelayMs : number = 5000;

    private getOrigin(): string {
        //@ts-ignore
        if( env.VITE_ENV === "development" )
            return "192.168.200.1";

        //@ts-ignore
        if( env.VITE_ENV === "staging" )
            return "bambu-controller";

        return window.location.origin.replace( "http://", "" );
    }

    async reboot() {
        this.isLoading = true;
        await axios.get( `http://${ this.getOrigin() }/api/reboot` );
    }

    mounted() {
        this.initWebSocket();

    }

    async initWebSocket() {
        if( this.shouldReloadOnConnect ) {
            this.showToast(
                'Controller Offline',
                'It appears your controller is offline, please wait while we try to re-establish the connection...', ''
            );

            if( this.wsRetryDelayMs < 60_000 )
                this.wsRetryDelayMs += 5000;

            await timeout(this.wsRetryDelayMs);
        }

        this.ws = new WebSocket( `ws://${ this.getOrigin() }/ws` );
        this.ws.onopen = this.onWsOpen.bind( this );
        this.ws.onmessage = this.onWsMessage.bind( this );
        this.ws.onclose = this.onWsClose.bind( this );
        this.ws.onerror = this.onWsError.bind( this );

        this.runPingInterval();
    }

    runPingInterval() {
        if( this.wsInterval !== null )
            clearInterval( this.wsInterval );

        this.wsInterval = setInterval( () => {
            if( this.ws.readyState !== WebSocket.OPEN )
                return;

            this.ws.send( 'ping' );
        }, 1000 );
    }

    onWsOpen() {
        console.log( 'ws connected!' );
        if( this.shouldReloadOnConnect )
            window.location.reload();
    }

    onWsMessage( event : any ) {
        console.log( 'Received message:', event.data );
    }

    onWsClose() {
        console.log( 'ws closed!' );
        this.shouldReloadOnConnect = true;
        this.initWebSocket();
    }

    onWsError( error : any ) {
        console.error( 'WebSocket error:', error );
        this.shouldReloadOnConnect = true;
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

export default toNative(App);

</script>