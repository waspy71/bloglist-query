import React from "react";
import '@testing-library/jest-dom'
import { screen, render } from '@testing-library/react'
import userEvent from "@testing-library/user-event";
import NewBlog from "./NewBlog";

describe('NewBlog form testing', () => {

    test.only('if button is clicked the form is submited with proper data', async () => {
        const user = userEvent.setup()
        const handleCreate = jest.fn()

        const input = {
            title : 'Poem',
            author : 'Micheal',
            url : 'mike.com'
        }
        const {container} = render(<NewBlog 
            handleCreate={handleCreate}
        />)

        const inputTitle = container.querySelector(`input[name="title"]`)
        const inputAuthor = container.querySelector(`input[name="author"]`)
        const inputUrl = container.querySelector(`input[name="url"]`)

        await user.type(inputTitle, input.title)        
        await user.type(inputAuthor, input.author)
        await user.type(inputUrl, input.url)

        const buttonCreate = screen.getByText('Create')
        await user.click(buttonCreate)

        expect(handleCreate.mock.calls[0][0]).toEqual(input)
        expect(handleCreate.mock.calls).toHaveLength(1)
        })
    })