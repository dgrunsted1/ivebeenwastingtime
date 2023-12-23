<script>

    $: profile = {name: "", rank: 0};

    
    async function soda_rank(e){
        document.getElementById('loading').classList.remove('hidden');
        const data = new FormData(this);

        const response = await fetch(this.action, {
            method: 'POST',
            body: data
        });

        /** @type {import('@sveltejs/kit').ActionResult} */
        const result = deserialize(await response.text());
        if (result.data.err) {
            alert(result.data.err);
            e.srcElement.value = "";
        } else if (result.type === 'success') {
            console.log(result.data);
            profile = result.data;
        }
        
        document.getElementById('loading').classList.add('hidden');
        // applyAction(result);
    }
</script>


<div class="link">
    <form method='POST' on:change|preventDefault={soda_rank}>
        <input placeholder="name" name="name" type="text" class="input input-bordered input-xs w-full text-center input-accent"/>
    </form>
</div>
<div class="h-5 flex justify-center">
    <span id="loading" class="loading loading-dots loading-lg hidden"></span>
</div>



