
import React from 'react'
import '@testing-library/jest-dom'
import userEvent from "@testing-library/user-event"
import { screen, render } from '@testing-library/react'
import Blog from "./Blog"

describe('testing Blog component ', () => {  
    let container
    const mockHandler = jest.fn()
    const mockLike = jest.fn()
    const user = userEvent.setup()

    const blogTest = {
        title: "Happy times",
        author: "Mikey Mike",
        url: "mikey.com",
        likes: 10,
        user: {
            username: 'Sum Ting Wong',
            name: 'Wong'
        }
    }

    beforeEach(() => {              
        container = render(<Blog 
            blog={blogTest} 
            toggleVisibility={mockHandler}
            handleLikes={mockLike}
            />).container
        })

    test('if only author & title displayed', async () => {
        const element = container.querySelector('.Blog')
        expect(element).toHaveTextContent('Happy times Mikey Mike')
        expect(element).not.toHaveTextContent('mikey.com')
        expect(element).not.toHaveTextContent('Likes :')
    })

    test('if url & likes are displayed after View button is clicked', async () => {
        const button = screen.getByText('View')
        await user.click(button)
        const element = container.querySelector('.Blog')
        expect(element).toHaveTextContent('Likes : 10')
        expect(element).toHaveTextContent('mikey.com')
    })

    test('clicking "like" button 2 times works', async () => {
        const buttonView = screen.getByText('View')
        await user.click(buttonView)
        const buttonLike = screen.getByText('like')
        await user.click(buttonLike)
        await user.click(buttonLike)
        expect(mockLike.mock.calls).toHaveLength(2)
    })

  
})
