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
class PrinterConfig extends Vue {
    @Prop()
    private settings : ISettings;
}

export default toNative(PrinterConfig);

</script>

<template>
    <Card>
        <CardHeader>
            <CardTitle>Printer Settings</CardTitle>
            <CardDescription>
                Configure your Bambu Lab printer here
            </CardDescription>
        </CardHeader>
        <CardContent class="grid gap-6">
            <div class="grid grid-cols-2 gap-4">
                <div class="grid gap-2">
                    <Label for="ip-address">IP Address</Label>
                    <Input id="ip-address" v-model="settings.printer.config.ipAddress" placeholder="eg: 192.168.1.5" />
                </div>
                <div class="grid gap-2">
                    <Label for="access-code">Access Code</Label>
                    <Input id="access-code" :disabled="settings.printer.status.online" v-model="settings.printer.config.accessCode" placeholder="eg: 613g24k1" />
                </div>
            </div>
            <div class="grid gap-2">
                <Label for="hostname">Serial Number</Label>
                <Input id="hostname" :disabled="settings.printer.status.online" v-model="settings.printer.config.serialNumber" placeholder="eg: 00M08B412000062" />
            </div>
        </CardContent>
    </Card>
</template>