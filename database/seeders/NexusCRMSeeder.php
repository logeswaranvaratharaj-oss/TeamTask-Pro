<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Contact;
use App\Models\Deal;
use App\Models\Task;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class NexusCRMSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create Main User
        $user = User::updateOrCreate(
            ['email' => 'logeswaranvaratharaj@gmail.com'],
            [
                'name' => 'Logeswaran Varatharaj',
                'password' => Hash::make('password'),
                'role' => 'admin'
            ]
        );

        // 2. Create Professional Contacts
        $contacts = [
            [
                'name' => 'Sarah Johnson',
                'email' => 's.johnson@acmecorp.com',
                'phone' => '+1 (555) 123-4567',
                'company' => 'Acme Corporation',
                'job_title' => 'Chief Technology Officer',
                'owner_id' => $user->id
            ],
            [
                'name' => 'Michael Chen',
                'email' => 'm.chen@globex.io',
                'phone' => '+1 (555) 987-6543',
                'company' => 'Globex Solutions',
                'job_title' => 'VP of Engineering',
                'owner_id' => $user->id
            ],
            [
                'name' => 'Elena Rodriguez',
                'email' => 'elena.r@initech.net',
                'phone' => '+1 (555) 444-5555',
                'company' => 'Initech Services',
                'job_title' => 'Procurement Lead',
                'owner_id' => $user->id
            ],
            [
                'name' => 'Marcus Thorne',
                'email' => 'm.thorne@starkindustries.com',
                'phone' => '+1 (555) 000-1111',
                'company' => 'Stark Industries',
                'job_title' => 'Supply Chain Manager',
                'owner_id' => $user->id
            ],
            [
                'name' => 'Sophia Lee',
                'email' => 's.lee@cyberdyne.ch',
                'phone' => '+1 (555) 222-3333',
                'company' => 'Cyberdyne Systems',
                'job_title' => 'Head of Innovation',
                'owner_id' => $user->id
            ]
        ];

        foreach ($contacts as $contactData) {
            Contact::create($contactData);
        }

        $allContacts = Contact::all();

        // 3. Create Professional Deals
        $deals = [
            [
                'title' => 'Enterprise Cloud Migration',
                'description' => 'Major infrastructure overhaul for Acme Corp, moving 500+ servers to private cloud.',
                'deal_value' => 245000.00,
                'pipeline_stage' => 'negotiation',
                'contact_id' => $allContacts[0]->id,
                'owner_id' => $user->id,
                'type' => 'team',
                'created_at' => Carbon::now()->subMonths(4)
            ],
            [
                'title' => 'Annual Security Audit',
                'description' => 'Standard compliance audit and vulnerability assessment for Globex.',
                'deal_value' => 45000.00,
                'pipeline_stage' => 'qualified',
                'contact_id' => $allContacts[1]->id,
                'owner_id' => $user->id,
                'type' => 'team',
                'created_at' => Carbon::now()->subMonths(2)
            ],
            [
                'title' => 'Q1 Software Licensing',
                'description' => 'Bulk renewal of development IDEs and productivity suite.',
                'deal_value' => 12500.00,
                'pipeline_stage' => 'closed_won',
                'contact_id' => $allContacts[2]->id,
                'owner_id' => $user->id,
                'type' => 'team',
                'created_at' => Carbon::now()->subMonths(1)
            ],
            [
                'title' => 'Logistics Portal MVP',
                'description' => 'Rapid prototyping of a custom portal for supply chain visibility.',
                'deal_value' => 85000.00,
                'pipeline_stage' => 'proposal',
                'contact_id' => $allContacts[3]->id,
                'owner_id' => $user->id,
                'type' => 'team',
                'created_at' => Carbon::now()->subWeeks(3)
            ],
            [
                'title' => 'Private Consultation - AI Ethics',
                'description' => 'Strategic advisory session for Sophia Lee regarding automated system guardrails.',
                'deal_value' => 5000.00,
                'pipeline_stage' => 'discovery',
                'contact_id' => $allContacts[4]->id,
                'owner_id' => $user->id,
                'type' => 'personal',
                'created_at' => Carbon::now()->subDays(10)
            ],
            [
                'title' => 'Data Lake Construction',
                'description' => 'Building a centralized repository for stark industries sensor data.',
                'deal_value' => 120000.00,
                'pipeline_stage' => 'negotiation',
                'contact_id' => $allContacts[3]->id,
                'owner_id' => $user->id,
                'type' => 'team',
                'created_at' => Carbon::now()->subMonths(6)
            ]
        ];

        foreach ($deals as $dealData) {
            Deal::create($dealData);
        }

        $allDeals = Deal::all();

        // 4. Create Activities (Tasks)
        $tasks = [
            [
                'title' => 'Draft Security Proposal',
                'description' => 'Create detailed breakdown of audit modules and pricing.',
                'deal_id' => $allDeals[1]->id,
                'assigned_to' => $user->id,
                'created_by' => $user->id,
                'priority' => 'high',
                'status' => 'in_progress',
                'due_date' => Carbon::now()->addDays(2)
            ],
            [
                'title' => 'Initial Discovery Call',
                'description' => 'Understand current cloud infrastructure and pain points.',
                'deal_id' => $allDeals[0]->id,
                'assigned_to' => $user->id,
                'created_by' => $user->id,
                'priority' => 'urgent',
                'status' => 'completed',
                'due_date' => Carbon::now()->subMonths(4)->addDays(5)
            ],
            [
                'title' => 'Follow-up on Proposal',
                'description' => 'Check if Marcus has any questions regarding the Logistics Portal quote.',
                'deal_id' => $allDeals[3]->id,
                'assigned_to' => $user->id,
                'created_by' => $user->id,
                'priority' => 'medium',
                'status' => 'todo',
                'due_date' => Carbon::now()->addDay()
            ],
            [
                'title' => 'Final Contract Review',
                'description' => 'Review legal terms before the Enterprise Migration signing.',
                'deal_id' => $allDeals[0]->id,
                'assigned_to' => $user->id,
                'created_by' => $user->id,
                'priority' => 'urgent',
                'status' => 'todo',
                'due_date' => Carbon::now()->addDays(4)
            ]
        ];

        foreach ($tasks as $taskData) {
            Task::create($taskData);
        }
    }
}
