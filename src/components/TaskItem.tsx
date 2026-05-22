import { FC, memo } from 'react'
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid'
import useStore from '../store'
import { Task } from '../types'
import { useMutateTask } from '../hooks/useMutateTask'

interface TaskItemProps extends Omit<Task, 'updated_at'> {
  completed?: boolean
  isOverdue?: boolean
}

const TaskItemMemo: FC<TaskItemProps> = ({
  id,
  title,
  completed,
  created_at,
  isOverdue,
}) => {
  const updateEditedTask = useStore((state) => state.updateEditedTask)
  const { deleteTaskMutation, updateTaskStatusMutation } = useMutateTask()
  return (
    <li className="my-3 flex items-center justify-between">
      <div className="flex items-center">
        <input
          type="checkbox"
          className="mr-3 cursor-pointer h-5 w-5 text-indigo-600 rounded border-gray-300"
          checked={!!completed}
          onChange={() => {
            updateTaskStatusMutation.mutate({
              id,
              completed: !completed,
            })
          }}
        />
        <span
          className={`font-bold ${completed ? 'line-through text-gray-400' : ''} ${
            isOverdue && !completed ? 'text-red-500' : ''
          }`}
        >
          {title}
        </span>
      </div>
      <div className="flex">
        <PencilIcon
          className="h-5 w-5 mx-1 text-blue-500 cursor-pointer"
          onClick={() => {
            updateEditedTask({
              id: id,
              title: title,
              completed: completed,
            })
          }}
        />
        <TrashIcon
          className="h-5 w-5 text-blue-500 cursor-pointer"
          onClick={() => {
            deleteTaskMutation.mutate(id)
          }}
        />
      </div>
    </li>
  )
}
export const TaskItem = memo(TaskItemMemo)
