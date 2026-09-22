import { db } from "./db";

type Tarefa = {
    autor: string;
    titulo: string;
    prazo: string;
}

type Tarefas = {
    todo: Tarefa[];
    doing: Tarefa[];
    done: Tarefa[];
};

type TarefaBanco = {
    id: number;
    titulo: string;
    autor: string;
    prazo: string;
    coluna: string;
};

function validarTarefa(item: unknown): item is Tarefa {
    if (typeof item !== 'object' || item === null) {
        return false;
    }
    const tarefa = item as Record<string, unknown>;

    return (
        typeof tarefa.titulo === 'string' &&
        typeof tarefa.autor === 'string' &&
        typeof tarefa.prazo === 'string'
    );
}

function validarTarefas(dados: unknown): dados is Tarefas {
    if (typeof dados !== 'object' || dados === null) {
        return false;
    }

    const tarefas = dados as Record<string, unknown>;

    return (
        Array.isArray(tarefas.todo) &&
        Array.isArray(tarefas.doing) &&
        Array.isArray(tarefas.done) &&
        tarefas.todo.every(validarTarefa) &&
        tarefas.doing.every(validarTarefa) &&
        tarefas.done.every(validarTarefa)
    );
}

const server = Bun.serve({
    port: 3000,
    hostname: '0.0.0.0',

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
            try {
                const tarefas = db.query(`
            SELECT id, titulo, autor, prazo, coluna
            FROM tarefas
        `).all() as TarefaBanco[];

                const dados = {
                    todo: tarefas.filter(tarefa => tarefa.coluna === 'todo'),
                    doing: tarefas.filter(tarefa => tarefa.coluna === 'doing'),
                    done: tarefas.filter(tarefa => tarefa.coluna === 'done')
                };

                return Response.json(dados);
            } catch {
                return new Response('Erro ao carregar tarefas', {
                    status: 500
                });
            }
        }

if (request.method === 'PUT' && url.pathname === '/api/tarefas') {
    try {
        const conteudo = await request.text();
        const dados = JSON.parse(conteudo);

        console.log('Dados recebidos:', dados);

        if (!validarTarefas(dados)) {
            return new Response('Estrutura inválida', {
                status: 400
            });
        }

        db.query('DELETE FROM tarefas').run();

        const inserir = db.query(`
            INSERT INTO tarefas (titulo, autor, prazo, coluna)
            VALUES (?, ?, ?, ?)
        `);

        for (const tarefa of dados.todo) {
            inserir.run(
                tarefa.titulo,
                tarefa.autor,
                tarefa.prazo,
                'todo'
            );
        }

        for (const tarefa of dados.doing) {
            inserir.run(
                tarefa.titulo,
                tarefa.autor,
                tarefa.prazo,
                'doing'
            );
        }

        for (const tarefa of dados.done) {
            inserir.run(
                tarefa.titulo,
                tarefa.autor,
                tarefa.prazo,
                'done'
            );
        }

        console.log(
            db.query('SELECT * FROM tarefas').all()
        );

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