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
import { Component, Prop, Vue } from "vue-facing-decorator";
import { ISettings } from "@/interfaces/settings";

@Component( {
    components: { Button, Label, Input, Card, CardContent, CardDescription, CardHeader, CardFooter, CardTitle}
})
export default class NetworkConfig extends Vue {
    @Prop()
    private settings : ISettings;
}

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
                    <Input id="ssid" v-model="settings.network.config.ssid" placeholder="My Network SSID" />
                </div>
                <div class="grid gap-2">
                    <Label for="password">Password</Label>
                    <Input id="password" v-model="settings.network.config.password" placeholder="My Network Password" />
                </div>
            </div>
            <div class="grid gap-2">
                <Label for="hostname">Hostname</Label>
                <Input id="hostname" v-model="settings.network.config.hostName" placeholder="bambu-controller" />
            </div>
        </CardContent>
        <CardFooter class="justify-end space-x-2">
            <Button @click="$emit('save')">Save</Button>
        </CardFooter>
    </Card>
</template>