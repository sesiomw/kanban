const server = Bun.serve({
    port: 3000,

    async fetch(request) {
        const url = new URL(request.url);

        if (request.method === 'GET' && url.pathname === '/api/tarefas') {
            const arquivo = Bun.file('data/tarefas.json');
            const conteudo = await arquivo.text();

            return new Response(conteudo, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        if (request.method === 'PUT' && url.pathname === '/api/tarefas') {
            const conteudo = await request.text();

            await Bun.write('data/tarefas.json', conteudo);
            
            return new Response('Tarefas salvas!');
        }


        return new Response('Rota não encontrada', {
            status: 404
        });
    }
});

console.log(`Servidor rodando em http://localhost:${server.port}`);