<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Group extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'owner_id',
        'last_message_id',
    ];

    public function users()
    {
        return $this->belongsToMany(User::class, 'group_users');
    }

    public function messages()
    {
        return $this->hasMany(Message::class);
    }

    public function owner()
    {
        return $this->belongsTo(User::class);
    }

    public function lastMessage()
    {
        return $this->belongsTo(Message::class, 'last_message_id');
    }

    public static function getGroupsForUser(User $user)
    {
        $query = self::select(['groups.*', 'messages.message as last_message', 'messages.created_at as last_message_date'])
            ->join('group_users as gu', 'gu.group_id', '=', 'groups.id')
            ->leftJoin('messages', 'messages.id', '=', 'groups.last_message_id')
            ->where('gu.user_id', $user->id)
            ->orderBy('messages.created_at', 'desc')
            ->orderBy('groups.name');

        return $query->get();
    }

    public function toConversationArray()
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'isGroup' => true,
            'isUser' => false,
            'ownerId' => $this->owner_id,
            'users' => $this->users,
            'userIds' => $this->users->pluck('id'),
            'createdAt' => $this->created_at,
            'updatedAt' => $this->updated_at,
            'lastMessage' => $this->last_message,
            'lastMessageDate' => $this->last_message_date ? ($this->last_message_date . ' UTC') : null,
        ];
    }

    public static function updateGroupWithMessage($groupId, $message)
    {
        // Create or update group with received group id and message
        return self::updateOrCreate(
            ['id' => $groupId], // Search conditions
            ['last_message_id' => $message->id], // Values to update
        );
    }
}
