import { db } from "./db";

type TarefaBanco = {
    id: number;
    titulo: string;
    autor: string;
    prazo: string;
    coluna: string;
};

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

if (request.method === 'POST' && url.pathname === '/api/tarefas') {
    try {
        const dados = await request.json();

        if (
            typeof dados.titulo !== 'string' ||
            typeof dados.autor !== 'string' ||
            typeof dados.prazo !== 'string'
        ) {
            return new Response('Dados inválidos', {
                status: 400
            });
        }

        const resultado = db.query(`
            INSERT INTO tarefas (titulo, autor, prazo, coluna)
            VALUES (?, ?, ?, ?)
        `).run(
            dados.titulo,
            dados.autor,
            dados.prazo,
            'todo'
        );

        return Response.json({
            id: resultado.lastInsertRowid
        });
    } catch {
        return new Response('Erro ao criar tarefa', {
            status: 500
        });
    }
}

if (request.method === 'PATCH' && url.pathname.startsWith('/api/tarefas/')) {
    try {
        const id = Number(url.pathname.split('/').pop());

        if (Number.isNaN(id)) {
            return new Response('ID inválido', {
                status: 400
            });
        }

        const dados = await request.json();

        if (
            typeof dados.coluna !== 'string' ||
            !['todo', 'doing', 'done'].includes(dados.coluna)
        ) {
            return new Response('Coluna inválida', {
                status: 400
            });
        }

        const resultado = db.query(`
            UPDATE tarefas
            SET coluna = ?
            WHERE id = ?
        `).run(dados.coluna, id);

        if (resultado.changes === 0) {
            return new Response('Tarefa não encontrada', {
                status: 404
            });
        }

        return new Response('Tarefa atualizada!');
    } catch {
        return new Response('Erro ao atualizar a tarefa', {
            status: 500
        });
    }
}

if (request.method === 'DELETE' && url.pathname.startsWith('/api/tarefas/')) {
    try {
        const id = Number(url.pathname.split('/').pop());

        if (Number.isNaN(id)) {
            return new Response('ID inválido', {
                status: 400
            });
        }

        const resultado = db.query(`
            DELETE FROM tarefas
            WHERE id = ?
        `).run(id);

        if (resultado.changes === 0) {
            return new Response('Tarefa não encontrada', {
                status: 404
            });
        }

        return new Response('Tarefa excluída!');
    } catch {
        return new Response('Erro ao excluir a tarefa', {
            status: 500
        });
    }
}

        return new Response('Rota não encontrada', {
            status: 404
        });
    }
});

console.log(`Servidor rodando em http://localhost:${server.port}`);