"use strict";

let number = 0;
const bbs = document.querySelector('#bbs');


document.querySelector('#post').addEventListener('click', () => {
    const name = document.querySelector('#name').value;
    const message = document.querySelector('#message').value;

    const params = {
        method: "POST",
        body: 'name=' + name + '&message=' + message,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
    fetch("/post", params)
        .then(response => {
            if (!response.ok) throw new Error('Error');
            return response.json();
        })
        .then(() => document.querySelector('#message').value = "");
});


document.querySelector('#check').addEventListener('click', () => {
    const params = {
        method: "POST",
        body: '',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
    fetch("/check", params)
        .then(response => {
            if (!response.ok) throw new Error('Error');
            return response.json();
        })
        .then(response => {
            const value = response.number;
            if (number != value) {
                fetch("/read", {
                    method: "POST",
                    body: 'start=' + number,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
                .then(response => {
                    if (!response.ok) throw new Error('Error');
                    return response.json();
                })
                .then(response => {
                    number += response.messages.length;
                    for (let mes of response.messages) {
                        createMessageElement(mes, bbs.childNodes.length);
                    }
                });
            }
        });
});

function createMessageElement(mes, index) {
    const cover = document.createElement('div');
    cover.className = 'cover';

    const name_area = document.createElement('span');
    name_area.className = 'name';
    name_area.innerText = mes.name;

    const mes_area = document.createElement('span');
    mes_area.className = 'mes';
    mes_area.innerText = mes.message;

    // 削除ボタン
    const deleteButton = document.createElement('button');
    deleteButton.innerText = '削除';
    deleteButton.addEventListener('click', () => deleteMessage(index));

    // 編集ボタン
    const editButton = document.createElement('button');
    editButton.innerText = '編集';
    editButton.addEventListener('click', () => editMessage(index));

    // いいねボタン
    const likeButton = document.createElement('button');
    likeButton.innerText = `いいね (${mes.likes || 0})`;
    likeButton.addEventListener('click', () => likeMessage(index, likeButton));

    cover.appendChild(name_area);
    cover.appendChild(mes_area);
    cover.appendChild(deleteButton);
    cover.appendChild(editButton);
    cover.appendChild(likeButton);

    bbs.appendChild(cover);
}

// メッセージ削除機能
function deleteMessage(index) {
    fetch('/delete', {
        method: "POST",
        body: 'index=' + index,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .then(response => response.json())
    .then(response => {
        if (response.success) {
            alert(response.message);
            location.reload();
        } else {
            alert(response.message);
        }
    });
}

// メッセージ編集機能
function editMessage(index) {
    const newMessage = prompt('新しいメッセージを入力してください:');
    if (newMessage) {
        fetch('/edit', {
            method: "POST",
            body: 'index=' + index + '&message=' + encodeURIComponent(newMessage),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        })
        .then(response => response.json())
        .then(response => {
            if (response.success) {
                alert(response.message);
                location.reload();
            } else {
                alert(response.message);
            }
        });
    }
}

// いいね機能
function likeMessage(index, button) {
    fetch('/like', {
        method: "POST",
        body: 'index=' + index,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .then(response => response.json())
    .then(response => {
        if (response.success) {
            button.innerText = `いいね (${response.likes})`;
        } else {
            alert(response.message);
        }
    });
}
