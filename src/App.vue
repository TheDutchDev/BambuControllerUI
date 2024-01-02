<template>
    <div class="flex flex-col w-screen h-screen">
        <header class="body-font border-b border-primary-300 mb-8 flex flex-row items-center">
            <div class="flex flex-wrap basis-1/4 p-5 flex-col md:flex-row">
                <a class="flex title-font font-medium mb-4 md:mb-0">
                    <h1 class="ml-3 text-4xl">Bambu Controller</h1>
                </a>
            </div>

            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger as-child>
                        <Button :disabled="isLoading"
                                class="flex items-center justify-center p-3 rounded-full w-20 h-20 fixed bottom-5 right-5"
                                @click="reboot">
                            <Loader2 class="w-10 h-10 animate-spin" v-if="isLoading"/>
                            <span class="material-symbols-outlined text-5xl" v-else>
                                power_settings_new
                            </span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Reboot</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

        </header>
        <RouterView/>
        <Toaster />
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
import { Component, Vue } from "vue-facing-decorator";

import Toaster from '@/components/ui/toast/Toaster.vue'
import { useToast } from '@/components/ui/toast/use-toast'

const { toast } = useToast();

const env = await import.meta.env;

@Component( {
    components: { Button, Loader2, Toaster, TooltipProvider, Tooltip, TooltipTrigger, TooltipContent }
} )
export default class App extends Vue {
    private isLoading: boolean = false;
    private ws: WebSocket;
    private wsInterval: number | null = null;
    private shouldReloadOnConnect: boolean = false;

    private getOrigin(): string {
        //@ts-ignore
        if( env.VITE_ENV === "development" )
            return "192.168.200.1";

        //@ts-ignore
        if( env.VITE_ENV === "staging" )
            return "bambu-controller";

        return window.location.origin;
    }

    async reboot() {
        this.isLoading = true;
        await axios.get( `http://${ this.getOrigin() }/api/reboot` );
    }

    mounted() {
        this.initWebSocket();

    }

    initWebSocket() {
        if( this.shouldReloadOnConnect ) {
            this.showToast(
                'Controller Offline',
                'It appears your controller is offline, please wait while we try to re-establish the connection...', ''
            );
        }

        this.ws = new WebSocket( `ws://${ this.getOrigin() }/ws` );
        this.ws.onopen = this.onWsOpen.bind( this );
        this.ws.onmessage = this.onWsMessage.bind( this );
        this.ws.onclose = this.onWsClose.bind( this );
        this.ws.onerror = this.onWsError.bind( this );

        this.runPingInterval();
    }

    runPingInterval( ) {
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

    onWsMessage( event ) {
        console.log( 'Received message:', event.data );
    }

    onWsClose() {
        console.log( 'ws closed!' );
        this.shouldReloadOnConnect = true;
        this.initWebSocket();
    }

    onWsError( error ) {
        console.error( 'WebSocket error:', error );
        this.shouldReloadOnConnect = true;
        this.initWebSocket();
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