<script lang="ts">
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Component, Prop, Vue, toNative } from "vue-facing-decorator";
import { ISettings } from "@/interfaces/settings";

@Component( {
    components: { Button, Label, Input, Card, CardContent, CardDescription, CardHeader, CardFooter, CardTitle}
})
class NetworkConfig extends Vue {
    @Prop()
    private settings : ISettings;
}

export default toNative(NetworkConfig);

</script>

<template>
    <Card>
        <CardHeader>
            <CardTitle>Network Settings</CardTitle>
            <CardDescription>
                Configure your network settings here
            </CardDescription>
        </CardHeader>
        <CardContent class="grid gap-6">
            <div class="grid grid-cols-2 gap-4">
                <div class="grid gap-2">
                    <Label for="ssid">SSID</Label>
                    <Input id="ssid" v-model="settings.network.config.ssid" placeholder="eg: MyNetworkSSID" />
                </div>
                <div class="grid gap-2">
                    <Label for="password">Password</Label>
                    <Input type="password" id="password" v-model="settings.network.config.password" placeholder="eg: MyNetworkPSK" />
                </div>
            </div>
            <div class="grid gap-2">
                <Label for="hostname">Hostname</Label>
                <Input id="hostname" v-model="settings.network.config.hostName" placeholder="bambu-controller" />
            </div>
        </CardContent>
    </Card>
</template>