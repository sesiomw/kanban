type Tarefas = {
    todo: string[];
    doing: string[];
    done: string[];
};

function validarTarefas(dados: unknown): dados is Tarefas {
    if (typeof dados !== 'object' || dados === null) {
        return false;
    }

    const tarefas = dados as Record<string, unknown>;

    return (
        Array.isArray(tarefas.todo) &&
        Array.isArray(tarefas.doing) &&
        Array.isArray(tarefas.done) &&
        tarefas.todo.every(item => typeof item === 'string') &&
        tarefas.doing.every(item => typeof item === 'string') &&
        tarefas.done.every(item => typeof item === 'string')
    );
}

const server = Bun.serve({
    port: 3000,

    async fetch(request) {
        const url = new URL(request.url);

        if (request.method === 'GET' && url.pathname === '/') {
            return new Response(Bun.file('index.html'));
        }

        if (request.method === 'GET' && url.pathname === '/style.css') {
            return new Response(Bun.file('style.css'));
        }

        if (request.method === 'GET' && url.pathname === '/script.js') {
            return new Response(Bun.file('script.js'));
        }

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
            try {
                const conteudo = await request.text();
                const dados = JSON.parse(conteudo);

                if (!validarTarefas(dados)) {
                    return new Response('Formato de tarefas inválido', {
                    });
                }

                await Bun.write('data/tarefas.json', conteudo);
            
                return new Response('Tarefas salvas!');
            } catch {
                return new Response('JSON inválido', {
                    status: 400
            });
        }
    }


        return new Response('Rota não encontrada', {
            status: 404
        });
    }
});

console.log(`Servidor rodando em http://localhost:${server.port}`);