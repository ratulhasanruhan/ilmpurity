import DataSortModal from '@/components/data-sort-modal';
import DeleteModal from '@/components/inertia/delete-modal';
import Switch from '@/components/switch';
import Tabs from '@/components/tabs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { router, useForm } from '@inertiajs/react';
import { ArrowUpDown, ChevronDown, Edit, ExternalLink, Plus, Settings, Trash2, X } from 'lucide-react';
import React, { useState } from 'react';

interface NavbarItemForm {
   type: string;
   slug: string;
   title: string;
   value: string;
   active: boolean;
   items: { title: string; url: string }[];
   sort: number;
   [key: string]: any;
}

const NavbarEditor = ({ navbar }: { navbar: Navbar }) => {
   const navbarItems = navbar.navbar_items;
   const [activeType, setActiveType] = useState<string>('url');
   const [editingItem, setEditingItem] = useState<NavbarItem | null>(null);
   const [isFormOpen, setIsFormOpen] = useState(false);

   const { data, setData, post, put, processing } = useForm<NavbarItemForm>({
      type: 'url',
      slug: '',
      title: '',
      value: '',
      items: [],
      active: true,
      sort: 0,
   });

   // Filter items by type
   const filteredItems = navbarItems.filter((item) => item.type === activeType);

   const openCreateForm = (type: string) => {
      setEditingItem(null);
      setData({
         type,
         slug: '',
         title: '',
         value: '',
         items: [],
         active: true,
         sort: Math.max(...navbarItems.map((item) => item.sort), 0) + 1,
      });
      setIsFormOpen(true);
   };

   const openEditForm = (item: NavbarItem) => {
      setEditingItem(item);
      setData({
         type: item.type,
         slug: item.slug,
         title: item.title,
         value: item.value || '',
         active: item.active,
         items: Array.isArray(item.items) ? item.items.map((subItem: any) => ({ title: subItem.title || '', url: subItem.url || '' })) : [],
         sort: item.sort,
      });
      setIsFormOpen(true);
   };

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      if (editingItem) {
         // Update existing item
         put(`/dashboard/settings/navbar-items/${editingItem.id}`, {
            onSuccess: () => {
               setIsFormOpen(false);
               router.reload({ only: ['navbar'] });
            },
         });
      } else {
         // Create new item
         post(`/dashboard/settings/navbar/${navbar.id}/items`, {
            onSuccess: () => {
               setIsFormOpen(false);
               router.reload({ only: ['navbar'] });
            },
         });
      }
   };

   const addDropdownItem = () => {
      setData((prev) => ({ ...prev, items: [...prev.items, { title: '', url: '' }] }));
   };

   const updateDropdownItem = (index: number, field: 'title' | 'url', value: string) => {
      const updatedItems = [...data.items];
      updatedItems[index] = { ...updatedItems[index], [field]: value };
      setData((prev) => ({ ...prev, items: updatedItems }));
   };

   const removeDropdownItem = (index: number) => {
      const updatedItems = data.items.filter((_: any, i: number) => i !== index);
      setData((prev) => ({ ...prev, items: updatedItems }));
   };

   return (
      <div className="p-4 sm:p-6">
         {/* Type Tabs */}
         <Tabs value={activeType} onValueChange={setActiveType}>
            <div className="mb-6 flex flex-col justify-between gap-6 md:flex-row md:items-center">
               <TabsList className="grid h-auto grid-cols-2 sm:h-10 sm:grid-cols-4">
                  <TabsTrigger value="url" className="flex h-8 cursor-pointer items-center gap-2">
                     <ExternalLink className="h-4 w-4" />
                     URL Items ({navbarItems.filter((item) => item.type === 'url').length})
                  </TabsTrigger>
                  <TabsTrigger value="dropdown" className="flex h-8 cursor-pointer items-center gap-2">
                     <ChevronDown className="h-4 w-4" />
                     Dropdowns ({navbarItems.filter((item) => item.type === 'dropdown').length})
                  </TabsTrigger>
                  <TabsTrigger value="action" className="flex h-8 cursor-pointer items-center gap-2">
                     <Settings className="h-4 w-4" />
                     Actions ({navbarItems.filter((item) => item.type === 'action').length})
                  </TabsTrigger>
               </TabsList>

               <div className="flex items-center gap-2">
                  <DataSortModal
                     title="Navbar Items"
                     data={filteredItems}
                     handler={
                        <Button variant="outline" className="flex items-center gap-2">
                           <ArrowUpDown className="h-4 w-4" />
                           Reorder
                        </Button>
                     }
                     onOrderChange={(newOrder, setOpen) => {
                        router.post(
                           route('settings.navbar.items.reorder'),
                           {
                              sortedData: newOrder,
                           },
                           { preserveScroll: true, onSuccess: () => setOpen && setOpen(false) },
                        );
                     }}
                     renderContent={(item) => (
                        <Card className="flex w-full items-center justify-between px-4 py-3">
                           <p>{item.title}</p>

                           <div className="flex items-center space-x-2">
                              <Label htmlFor="active">Active</Label>
                              <Switch
                                 id="active"
                                 defaultChecked={item.active}
                                 onCheckedChange={(checked) => {
                                    router.put(`/dashboard/settings/navbar-items/${item.id}`, {
                                       ...(item as any),
                                       active: checked,
                                    });
                                 }}
                              />
                           </div>
                        </Card>
                     )}
                  />

                  {activeType !== 'action' && (
                     <Button onClick={() => openCreateForm(activeType)} className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Add <span className="capitalize">{activeType}</span>
                     </Button>
                  )}
               </div>
            </div>

            {/* URL Items */}
            <TabsContent value="url" className="space-y-4">
               {filteredItems.length > 0 ? (
                  <div className="space-y-4">
                     {filteredItems.map((item) => (
                        <div key={item.id} className="bg-muted flex items-center gap-3 rounded-lg p-3">
                           <ExternalLink className="h-4 w-4" />

                           <div className="flex-1">
                              <div className="font-medium">{item.title}</div>
                              <div className="text-sm text-gray-600">{item.value}</div>
                           </div>

                           <div className="flex gap-2">
                              <Button variant="secondary" size="icon" className="h-8 w-8" onClick={() => openEditForm(item)}>
                                 <Edit className="h-3 w-3" />
                              </Button>
                              <DeleteModal
                                 routePath={route('settings.navbar.items.destroy', item.id)}
                                 actionComponent={
                                    <Button variant="ghost" className="bg-destructive/8 hover:bg-destructive/6 h-8 w-8">
                                       <Trash2 className="text-destructive h-3 w-3" />
                                    </Button>
                                 }
                              />
                           </div>
                        </div>
                     ))}
                  </div>
               ) : (
                  <div className="py-8 text-center text-gray-500">No URL items found. Click "Add URL Item" to create one.</div>
               )}
            </TabsContent>

            {/* Dropdown Items */}
            <TabsContent value="dropdown" className="space-y-4">
               {filteredItems.length > 0 ? (
                  <div className="space-y-4">
                     {filteredItems.map((item, index) => (
                        <div key={item.id} className="bg-muted rounded-lg p-3">
                           <div className="flex items-center gap-3">
                              <ChevronDown className="h-4 w-4" />

                              <div className="flex-1">
                                 <div className="font-medium">{item.title}</div>
                              </div>

                              <div className="flex gap-2">
                                 <Button variant="secondary" size="icon" className="h-8 w-8" onClick={() => openEditForm(item)}>
                                    <Edit className="h-3 w-3" />
                                 </Button>
                                 <DeleteModal
                                    routePath={route('settings.navbar.items.destroy', item.id)}
                                    actionComponent={
                                       <Button variant="ghost" className="bg-destructive/8 hover:bg-destructive/6 h-8 w-8">
                                          <Trash2 className="text-destructive h-3 w-3" />
                                       </Button>
                                    }
                                 />
                              </div>
                           </div>
                           {item.items && Array.isArray(item.items) && (
                              <div className="ml-8 space-y-1">
                                 {(item.items as any[]).map((subItem: any, idx: number) => (
                                    <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                                       <span>•</span>
                                       <span>{subItem.title}</span>
                                       <span className="text-gray-400">({subItem.url})</span>
                                    </div>
                                 ))}
                              </div>
                           )}
                        </div>
                     ))}
                  </div>
               ) : (
                  <div className="py-8 text-center text-gray-500">No dropdown items found. Click "Add Dropdown" to create one.</div>
               )}
            </TabsContent>

            {/* Action Items */}
            <TabsContent value="action" className="space-y-4">
               {filteredItems.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                     {filteredItems.map((item) => (
                        <div key={item.id} className="bg-muted flex items-center justify-between gap-3 rounded-lg border p-3">
                           <div className="flex items-center gap-3">
                              <Settings className="h-4 w-4" />

                              <p className="text-sm font-medium">{item.title}</p>
                           </div>

                           <div className="flex items-center space-x-2">
                              <Label htmlFor="airplane-mode">Active</Label>
                              <Switch
                                 id="airplane-mode"
                                 checked={item.active}
                                 onCheckedChange={(checked) => {
                                    router.put(`/dashboard/settings/navbar-items/${item.id}`, {
                                       ...(item as any),
                                       active: checked,
                                    });
                                 }}
                              />
                           </div>
                        </div>
                     ))}
                  </div>
               ) : (
                  <div className="py-8 text-center text-gray-500">No action items found. Click "Add Action Item" to create one.</div>
               )}
            </TabsContent>
         </Tabs>

         {/* Create/Edit Form Dialog */}
         <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogContent className="max-w-2xl">
               <DialogHeader>
                  <DialogTitle>
                     {editingItem ? 'Edit' : 'Create'} {data.type.charAt(0).toUpperCase() + data.type.slice(1)} Item
                  </DialogTitle>
                  <DialogDescription>
                     {editingItem ? 'Update the details of this navbar item.' : 'Add a new navbar item to your navigation.'}
                  </DialogDescription>
               </DialogHeader>

               <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                     <Label>Status</Label>
                     <Select
                        value={data.active ? 'Active' : 'Deactive'}
                        onValueChange={(value) => setData((prev) => ({ ...prev, active: value === 'Active' }))}
                     >
                        <SelectTrigger>
                           <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectItem value="Active">Active</SelectItem>
                           <SelectItem value="Deactive">Deactive</SelectItem>
                        </SelectContent>
                     </Select>
                  </div>
                  <div>
                     <Label htmlFor="title">Title</Label>
                     <Input
                        id="title"
                        value={data.title}
                        onChange={(e) => setData((prev) => ({ ...prev, title: e.target.value }))}
                        placeholder="Enter title"
                        required
                     />
                  </div>
                  <div>
                     <Label htmlFor="slug">Slug</Label>
                     <Input
                        id="slug"
                        value={data.slug}
                        onChange={(e) => setData((prev) => ({ ...prev, slug: e.target.value }))}
                        placeholder="Enter unique slug"
                        required
                     />
                  </div>

                  {data.type === 'url' && (
                     <div>
                        <Label htmlFor="value">URL</Label>
                        <Input
                           id="value"
                           value={data.value}
                           onChange={(e) => setData((prev) => ({ ...prev, value: e.target.value }))}
                           placeholder="Enter URL (e.g., /courses, https://example.com)"
                           required
                        />
                     </div>
                  )}

                  {data.type === 'dropdown' && (
                     <div>
                        <div className="mb-2 flex items-center justify-between">
                           <Label>Dropdown Items</Label>
                           <Button type="button" variant="outline" size="sm" onClick={addDropdownItem}>
                              <Plus className="mr-1 h-3 w-3" />
                              Add Item
                           </Button>
                        </div>
                        <div className="max-h-48 space-y-2 overflow-y-auto">
                           {data.items.map((item, index) => (
                              <div key={index} className="flex items-center gap-2 rounded border p-2">
                                 <Input
                                    value={item.title}
                                    onChange={(e) => updateDropdownItem(index, 'title', e.target.value)}
                                    placeholder="Title"
                                    className="flex-1"
                                 />
                                 <Input
                                    value={item.url}
                                    onChange={(e) => updateDropdownItem(index, 'url', e.target.value)}
                                    placeholder="URL"
                                    className="flex-1"
                                 />
                                 <Button type="button" variant="ghost" size="sm" onClick={() => removeDropdownItem(index)}>
                                    <X className="h-3 w-3" />
                                 </Button>
                              </div>
                           ))}
                        </div>
                     </div>
                  )}

                  {data.type === 'action' && (
                     <div>
                        <Label htmlFor="action-type">Action Type</Label>
                        <Select value={data.slug} onValueChange={(value) => setData((prev) => ({ ...prev, slug: value }))}>
                           <SelectTrigger>
                              <SelectValue placeholder="Select action type" />
                           </SelectTrigger>
                           <SelectContent>
                              <SelectItem value="theme">Theme Toggle</SelectItem>
                              <SelectItem value="search">Search</SelectItem>
                              <SelectItem value="notification">Notifications</SelectItem>
                              <SelectItem value="profile">User Profile</SelectItem>
                           </SelectContent>
                        </Select>
                     </div>
                  )}

                  <DialogFooter>
                     <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                        Cancel
                     </Button>
                     <Button type="submit" disabled={processing}>
                        {processing ? 'Saving...' : editingItem ? 'Update' : 'Create'}
                     </Button>
                  </DialogFooter>
               </form>
            </DialogContent>
         </Dialog>
      </div>
   );
};

export default NavbarEditor;
