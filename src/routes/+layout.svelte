<script lang="ts">
    import NavBar, { type NavItem } from "$lib/components/generics/NavBar.svelte";
    
    import "../global.css"; // its nice to have a style sheet applied to the entire app, this is one way to do it.

    let navTargets: NavItem[] = [
        {
            name: "Home",
            target: "/",
        },
        {
            name: "Todo",
            target: "/message",
        },
        {
            name: "About",
            target: "/about",
        },
    ];


</script>

<!-- make the NavBar in layout so that every subpage gets it. -->
<NavBar navItems={navTargets} />

<slot />
