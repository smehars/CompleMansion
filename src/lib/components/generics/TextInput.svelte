<script lang="ts">
    export let value: string ="Default name";

    export let placeholder = "type here...";
    export let disabled = false;
    export let label = "";

    export let style ="";
</script>

<div id="inputHolder" {style}>
    {#if label.length > 0}
        <label for="textinput">{label}</label>
    {/if}
    <input name="textinput" type="text" bind:value {placeholder} {disabled}/>
</div>

<style>
    input {
        border: var(--focus) 2px solid;
        border-radius: 5px;
        background-color: var(--fg0);
        padding: 0.5rem;
        margin: 0.25rem;

        outline: 0;

        flex:1;
    }

    #inputHolder {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
</style>
