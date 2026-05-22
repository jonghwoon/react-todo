import { FormEvent, useMemo } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import {
  ArrowRightOnRectangleIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/solid'
import useStore from '../store'
import { useQueryTasks } from '../hooks/useQueryTasks'
import { useMutateTask } from '../hooks/useMutateTask'
import { useMutateAuth } from '../hooks/useMutateAuth'
import { TaskItem } from './TaskItem'

const getLocalDateStr = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const Todo = () => {
  const queryClient = useQueryClient()
  const { editedTask } = useStore()
  const updateTask = useStore((state) => state.updateEditedTask)
  const { data, isLoading } = useQueryTasks()
  const { createTaskMutation, updateTaskMutation } = useMutateTask()
  const { logoutMutation } = useMutateAuth()
  const submitTaskHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (editedTask.id === 0)
      createTaskMutation.mutate({
        title: editedTask.title,
      })
    else {
      updateTaskMutation.mutate(editedTask)
    }
  }
  const logout = async () => {
    await logoutMutation.mutateAsync()
    queryClient.removeQueries(['tasks'])
  }

  const groupedTasks = useMemo(() => {
    if (!data) return []

    const groups: Record<string, typeof data> = {}
    const todayStr = getLocalDateStr(new Date())

    data.forEach((task) => {
      let createdDateStr = todayStr
      if (task.created_at) {
        createdDateStr = getLocalDateStr(new Date(task.created_at))
      }

      let groupDateStr = createdDateStr

      if (!task.completed && createdDateStr < todayStr) {
        groupDateStr = todayStr
      }

      if (!groups[groupDateStr]) {
        groups[groupDateStr] = []
      }
      groups[groupDateStr].push(task)
    })

    return Object.keys(groups)
      .sort((a, b) => (a < b ? 1 : -1))
      .map((date) => ({
        date,
        tasks: groups[date],
      }))
  }, [data])

  return (
    <div className="flex justify-center items-center flex-col min-h-screen text-gray-600 font-mono">
      <div className="flex items-center my-3">
        <ShieldCheckIcon className="h-8 w-8 mr-3 text-indigo-500 cursor-pointer" />
        <span className="text-center text-3xl font-extrabold">
          Task Manager
        </span>
      </div>
      <ArrowRightOnRectangleIcon
        onClick={logout}
        className="h-6 w-6 my-6 text-blue-500 cursor-pointer"
      />
      <form onSubmit={submitTaskHandler}>
        <input
          className="mb-3 mr-3 px-3 py-2 border border-gray-300"
          placeholder="title ?"
          type="text"
          onChange={(e) => updateTask({ ...editedTask, title: e.target.value })}
          value={editedTask.title || ''}
        />
        <button
          className="disabled:opacity-40 mx-3 py-2 px-3 text-white bg-indigo-600 rounded"
          disabled={!editedTask.title}
        >
          {editedTask.id === 0 ? 'Create' : 'Update'}
        </button>
      </form>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="my-5 w-full max-w-sm">
          {groupedTasks.map(({ date, tasks }) => (
            <div key={date} className="mb-6">
              <h3 className="text-xl font-bold mb-2 border-b-2 border-indigo-200 pb-1 text-indigo-500">
                {date === getLocalDateStr(new Date()) ? 'Today' : date}
              </h3>
              <ul>
                {tasks.map((task) => {
                  const createdDateStr = task.created_at
                    ? getLocalDateStr(new Date(task.created_at))
                    : date
                  const isOverdue =
                    !task.completed &&
                    createdDateStr < getLocalDateStr(new Date())

                  return (
                    <TaskItem
                      key={task.id}
                      id={task.id}
                      title={task.title}
                      completed={task.completed}
                      created_at={task.created_at}
                      isOverdue={isOverdue}
                    />
                  )
                })}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
