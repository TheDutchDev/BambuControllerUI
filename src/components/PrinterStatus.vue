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
import { EFilamentType } from "@/enums/filamentType";
import { EPrinterState } from "@/enums/printerState";

@Component( {
    components: { Button, Label, Input, Card, CardContent, CardDescription, CardHeader, CardFooter, CardTitle}
})
class PrinterStatus extends Vue {
    @Prop()
    private settings : ISettings;

    public get getActivity() : string {
        switch( this.settings.printer.status.state)
        {
            case EPrinterState.Idle:
                return "Idle";
            case EPrinterState.Finished:
                return "Finished";
            case EPrinterState.Failed:
                return "Print Failed";
            case EPrinterState.Slicing:
                return "Slicing...";
            case EPrinterState.Running:
                return "Printing...";
            case EPrinterState.Prepare:
                return "Preparing...";
            default:
                return "Unknown";
        }
    }

    public toFilamentType(type : EFilamentType) {
        switch( type ) {
            case EFilamentType.PLA:
                return "PLA";
            case EFilamentType.PETG:
                return "PETG";
            case EFilamentType.TPU:
                return "TPU";
            case EFilamentType.PA:
                return "PA";
            case EFilamentType.PC:
                return "PC";
            case EFilamentType.ABS:
                return "ABS";
            case EFilamentType.ASA:
                return "ASA";
            default:
                return "Unknown";
        }
    }
}

export default toNative(PrinterStatus);

</script>

<template>
    <Card>
        <CardHeader>
            <CardTitle>Printer Status</CardTitle>
            <CardDescription>

            </CardDescription>
        </CardHeader>
        <CardContent class="grid gap-6">
            <div class="grid grid-cols-2 gap-4">
                <div class="grid gap-2">
                    <Label>Status</Label>
                    <Label class="flex justify-start items-center gap-3"><span class="rounded pr-2 pl-2 inline-flex" :style="{ 'background-color': settings.printer.status.online ? '#080' : '#800' }">{{ settings.printer.status.online ? 'Online' : 'Offline' }}</span></Label>
                </div>
                <div class="grid gap-2">
                    <Label>Current Filament: </Label>
                    <Label class="flex justify-start items-center gap-3"><span class="rounded pr-2 pl-2 inline-flex" :style="{ 'background-color': `#${settings.printer.filament.status.color}`}">{{ toFilamentType( settings.printer.filament.status.type ) }}</span></Label>
                </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div class="grid gap-2">
                    <Label>Activity</Label>
                    <Label class="font-normal flex justify-start items-center gap-3">{{ getActivity }}</Label>
                </div>
            </div>
        </CardContent>
    </Card>
</template>