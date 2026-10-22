import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type Item = {
  id: string
  title: string
  description: string | null
  completed: boolean
  created_at: string
}

export default function ItemsPage() {
  const { user, signOut } = useAuth()
  const [items, setItems] = useState<Item[]>([])
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) setItems(data)
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const addItem = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !user) return

    const { error } = await supabase
      .from('items')
      .insert({ title: title.trim(), user_id: user.id })

    if (!error) {
      setTitle('')
      load()
    }
  }

  const toggle = async (item: Item) => {
    await supabase
      .from('items')
      .update({ completed: !item.completed })
      .eq('id', item.id)
    load()
  }

  const remove = async (id: string) => {
    await supabase.from('items').delete().eq('id', id)
    load()
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-900">My Items</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500 hidden sm:inline">{user?.email}</span>
            <Button variant="outline" size="sm" onClick={signOut}>Sign out</Button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Add an item</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={addItem} className="flex gap-2">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What needs doing?"
              />
              <Button type="submit">Add</Button>
            </form>
          </CardContent>
        </Card>

        {loading ? (
          <p className="text-slate-500 text-sm">Loading…</p>
        ) : items.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-slate-500">
              No items yet. Add your first one above.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {items.map((item) => (
              <Card key={item.id}>
                <CardContent className="py-3 flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => toggle(item)}
                    className="h-4 w-4"
                  />
                  <span className={item.completed ? 'line-through text-slate-400 flex-1' : 'flex-1'}>
                    {item.title}
                  </span>
                  <Button variant="ghost" size="sm" onClick={() => remove(item.id)}>
                    Delete
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}